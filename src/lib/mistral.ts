import { Ollama } from 'ollama-node';
import { z } from "zod";

const SentimentSchema = z.object({
    violence: z.boolean(),
    side: z.string(),
    snippet: z.string(),
});

export type Sentiment = z.infer<typeof SentimentSchema>;

class Mistral {
    private ollama: Ollama;
    private mode: 'local' | 'remote';

    constructor(mode: 'local' | 'remote') {
        this.mode = mode;
        this.ollama = new Ollama();
    }

    async start(): Promise<void> {
        if (this.mode === 'local') await this.ollama.setModel("mistral")
    }

    async isFlagged(text: string): Promise<boolean> {
        const prompt = `If the post explicitly incites violence, reply with 'YES'. Otherwise, reply 'NO'. Do NOT explain. Post: ${text}\n\nOutput: `
        const output = await this.submit(prompt);
        return output.startsWith("YES")
    }

    async getSentiment(post: string): Promise<Sentiment> {
        const prompt = `For the following post, respond with a JSON object that includes the following fields: - "violence": A boolean flag, indicating if the post explicitly incites violence. - "side": A string indicating the side for which the author of the post likely supports (either Palestine or Israel) - "snippet": The most hateful snippet in the post (maximum of 10 words). Post: ${post}`;
        const response = await this.submit(prompt);
        return SentimentSchema.parse(JSON.parse(response));
    }

    async submit(prompt: string) {
        if (this.mode === 'local') {
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

export default new Mistral('remote');