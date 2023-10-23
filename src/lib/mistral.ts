import { Ollama } from 'ollama-node';

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
        const prompt = `If the post explicitly contains hate speech or directly incites violence, reply with 'YES'. Otherwise, reply 'NO'. Do NOT explain. Post: ${text}`
        const output = await this.submit(prompt);
        return output.startsWith("YES")
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

    async _remote(prompt: string) {
        const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.FIREWORKS_API_KEY!}`
                },
                body: JSON.stringify({
                    "messages": [
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    "model": "accounts/fireworks/models/mistral-7b-instruct-4k"
                })
            });
            const data = await response.json();
            return data.choices[0].message.content
    }
}

export default new Mistral('remote');