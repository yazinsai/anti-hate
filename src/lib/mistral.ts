import { Ollama } from 'ollama-node';

class Mistral {
    private ollama: Ollama;

    constructor() {
        this.ollama = new Ollama();
    }

    async start(): Promise<void> {
        await this.ollama.setModel("mistral")
    }

    async isFlagged(text: string): Promise<boolean> {
        const prompt = `If the post contains hate speech or incites violence, reply with 'YES'. Otherwise, reply 'NO'. Post: ${text}`
        const { output } = await this.ollama.generate(prompt);
        return output.startsWith("YES")
    }
}

export default new Mistral();
