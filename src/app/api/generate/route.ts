// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  ParsedEvent,
  ReconnectInterval,
  createParser,
} from "eventsource-parser";

export const config = {
  runtime: "edge",
};

const ORIGINAL_MESSAGE = `Dear [EMPLOYER],

We've come across a concerning post by your employee, [EMPLOYEE_NAME], dated [POST_DATE]. This content is not only alarming but could reflect negatively on any affiliated organization.

[POST_CONTENT]

The gravity of such a post can have serious implications. An association with such views could tarnish your company's reputation, compromising its public trust.

Given the severity, we strongly urge you to:

Address this issue immediately with the concerned employee.
Ensure the removal of the post to prevent further spread.
Re-emphasize your company's code of conduct to all staff, making clear that such views are not endorsed or tolerated.
Implement sensitivity, diversity, and inclusion training as a proactive step to cultivate a respectful workplace environment.
We cannot stress enough the urgency and sensitivity required in handling this matter. Delayed or inadequate action could escalate concerns among stakeholders.

We expect and trust that your company will take decisive and appropriate steps to rectify this situation and ensure such incidents are not repeated.

Regards,`;

const generateUniqueEmail = async () => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      max_tokens: 2048,
      frequency_penalty: 0,
      presence_penalty: 0,
      top_p: 1,
      temperature: 1,
      messages: [
        {
          role: "system",
          content:
            "You are an experienced English writer. Follow the instructions carefully.",
        },
        {
          role: "user",
          content: `0 being colloquial and 10 being academic, use level 7 formality to paraphrase:\n\n${ORIGINAL_MESSAGE}`,
        },
      ],
      stream: true,
    }),
  });

  if (response.status !== 200) {
    throw new Error("OpenAI API returned an error");
  }

  return streamFromResponse(response);
};

const streamFromResponse = (response: any): ReadableStream => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type !== "event") return;

        const data = event.data;

        if (data === "[DONE]") {
          controller.close();
          return;
        }

        try {
          const json = JSON.parse(data);
          const text = json.choices[0]?.delta?.content;
          if (!text) return;

          controller.enqueue(encoder.encode(text));
        } catch (e) {
          controller.error(e);
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of response.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    },
  });
};

export async function POST(request: Request) {
  try {
    // const json = await request.json()
    // EMPLOYER
    // EMPLOYEE_NAME
    // POST
    // POST_CONTENT
    const stream = await generateUniqueEmail();
    return new Response(stream);
  } catch (error) {
    console.error("Error during translation:", error);
    return new Response(JSON.stringify({ error: "Error during translation" }), {
      status: 500,
    });
  }
}
