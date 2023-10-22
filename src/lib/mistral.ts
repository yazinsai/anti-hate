import { Ollama } from 'ollama-node';

class Mistral {
    private ollama: Ollama;

    constructor() {
        this.ollama = new Ollama();
    }

    async start(): Promise<void> {
        await this.ollama.setModel("llama2")
    }

    async shouldBeFlagged(text: string): Promise<boolean> {
        const prompt = `If the post below contains any hate speech or incites violence, reply with 'YES' else reply with 'NO'. --- Post --- ${text}`
        const { output } = await this.ollama.generate(prompt);
        return output.toLowerCase().includes("yes")
    }
}

export default new Mistral();
