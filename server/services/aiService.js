import Groq from 'groq-sdk';
import axios from 'axios';

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'groq';
    this.groqKey = process.env.GROQ_API_KEY || '';
    this.openrouterKey = process.env.OPENROUTER_API_KEY || '';
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.AI_MODEL || 'llama-3.3-70b-versatile';

    if (this.groqKey) {
      this.groqClient = new Groq({ apiKey: this.groqKey });
    }
  }

  async generateCompletion({ prompt, systemPrompt, temperature = 0.2, jsonMode = false }) {
    const provider = process.env.AI_PROVIDER || this.provider;

    // 1. Try Groq
    if (provider === 'groq' && (process.env.GROQ_API_KEY || this.groqKey)) {
      try {
        const client = this.groqClient || new Groq({ apiKey: process.env.GROQ_API_KEY });
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const response = await client.chat.completions.create({
          messages,
          model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
          temperature,
          ...(jsonMode && { response_format: { type: 'json_object' } }),
        });

        return response.choices[0]?.message?.content || '';
      } catch (err) {
        console.warn('Groq API error, attempting fallback:', err.message);
      }
    }

    // 2. Try OpenRouter
    if (provider === 'openrouter' && (process.env.OPENROUTER_API_KEY || this.openrouterKey)) {
      try {
        const key = process.env.OPENROUTER_API_KEY || this.openrouterKey;
        const messages = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: prompt });

        const response = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: process.env.AI_MODEL || 'meta-llama/llama-3.3-70b-instruct',
            messages,
            temperature,
          },
          {
            headers: {
              Authorization: `Bearer ${key}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return response.data.choices[0]?.message?.content || '';
      } catch (err) {
        console.warn('OpenRouter API error, attempting fallback:', err.message);
      }
    }

    // 3. Try Ollama (Local)
    if (provider === 'ollama') {
      try {
        const response = await axios.post(`${this.ollamaBaseUrl}/api/generate`, {
          model: process.env.AI_MODEL || 'llama3',
          prompt: `${systemPrompt ? systemPrompt + '\n\n' : ''}${prompt}`,
          stream: false,
          temperature,
        });

        return response.data.response || '';
      } catch (err) {
        console.warn('Ollama API error, attempting fallback:', err.message);
      }
    }

    return null;
  }
}

export const aiService = new AIService();
export default aiService;
