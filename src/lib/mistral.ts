import { Ollama } from 'ollama-node';
import { z } from "zod";
import heal from "json-heal";

const SentimentSchema = z.object({
    violence: z.boolean(),
    side: z.string().nullable().default("Palestine"),
    snippet: z.string().nullable().default(""),
});

export type Sentiment = z.infer<typeof SentimentSchema>;

class Mistral {
    private ollama: Ollama;
    private mode: 'local' | 'remote';

    constructor(mode: 'local' | 'remote') {
        this.mode = mode;
        this.ollama = new Ollama();
    }

    async isFlagged(text: string): Promise<boolean> {
        const prompt = `If the post explicitly incites violence, reply with 'YES'. Otherwise, reply 'NO'. Do NOT explain. Post: ${text}\n\nOutput: `
        const output = await this.submit(prompt);
        return output.startsWith("YES")
    }

    async getSentiment(post: string): Promise<Sentiment> {
        const cleanedPost = post.replace(/\n/g, '');
        const prompt = `For the following post, respond with a JSON object that includes the following fields: - "violence": A boolean flag, indicating if the post explicitly incites violence. - "side": A string indicating the side for which the author of the post likely supports (either Palestine or Israel) - "snippet": The most hateful snippet in the post (maximum of 10 words). Post: ${cleanedPost}\n\nOutput:`;
        const response = cleanup(await this.submit(prompt));

        // Attempt to heal (mildly) malformed JSON
        let json;
        try {
            json = JSON.parse(response);
        } catch (e) {
            const healed = heal(response)
            json = JSON.parse(healed)
        }

        let data;
        try {
            data = SentimentSchema.parse(json);
        } catch (e) {
            console.error(e);
            throw e;
        }

        return data;
    }

    async submit(prompt: string) {
        if (this.mode === 'local') {
            await this.ollama.setModel("mistral")
            return this._local(prompt);
        } else {
            return this._remote(prompt);
        }
    }

    // Private helpers
    async _local(prompt: string) {
        const { output } = await this.ollama.generate(prompt);
        return output
    }

    // Find models through curl -H 'Authorization: Bearer $FIREWORKS_API_KEY'  https://api.fireworks.ai/inference/v1/models
    async _remote(prompt: string) {
        const response = await fetch('https://api.fireworks.ai/inference/v1/completions', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.FIREWORKS_API_KEY!}`
            },
            body: JSON.stringify({
                model: "accounts/fireworks/models/mistral-7b-instruct-4k",
                prompt,
                n: 1,
                max_tokens: 50,
                temperature: 0,
                top_p: 0,
            })
        });
        const data = await response.json();
        return data.choices[0].text.trim()
    }
}

function cleanup(response: string) {
    return response
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/\n/g, '')
        .trim();
}

export default new Mistral('remote');