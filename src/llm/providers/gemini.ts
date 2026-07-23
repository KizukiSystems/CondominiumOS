import { GoogleGenAI } from '@google/genai';
import type { LlmAdapter, LlmConfig, LlmRequest, LlmResponse } from '../adapter';
import { DEFAULT_MAX_TOKENS } from '../adapter';

export function createGeminiAdapter(config: LlmConfig): LlmAdapter {
  const client = new GoogleGenAI({ apiKey: config.apiKey });
  return {
    config,
    async generate(request: LlmRequest): Promise<LlmResponse> {
      const response = await client.models.generateContent({
        model: config.model,
        contents: request.prompt,
        config: {
          ...(request.system ? { systemInstruction: request.system } : {}),
          ...(request.json ? { responseMimeType: 'application/json' } : {}),
          ...(request.json?.schema ? { responseJsonSchema: request.json.schema } : {}),
          maxOutputTokens: request.maxTokens ?? DEFAULT_MAX_TOKENS,
        },
      });
      const text = response.text;
      if (!text) {
        throw new Error(`Gemini returned an empty response (model ${config.model})`);
      }
      return { text, provider: 'gemini', model: config.model };
    },
  };
}
