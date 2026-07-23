import Anthropic from '@anthropic-ai/sdk';
import type { LlmAdapter, LlmConfig, LlmRequest, LlmResponse } from '../adapter';
import { DEFAULT_MAX_TOKENS } from '../adapter';

export function createAnthropicAdapter(config: LlmConfig): LlmAdapter {
  const client = new Anthropic({ apiKey: config.apiKey });
  return {
    config,
    async generate(request: LlmRequest): Promise<LlmResponse> {
      const response = await client.messages.create({
        model: config.model,
        max_tokens: request.maxTokens ?? DEFAULT_MAX_TOKENS,
        ...(request.system ? { system: request.system } : {}),
        ...(request.json?.schema
          ? {
              output_config: {
                format: { type: 'json_schema' as const, schema: request.json.schema },
              },
            }
          : {}),
        messages: [{ role: 'user', content: request.prompt }],
      });
      if (response.stop_reason === 'refusal') {
        throw new Error(`Anthropic model ${config.model} refused the request`);
      }
      const text = response.content
        .filter((block): block is Anthropic.TextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('');
      if (!text) {
        throw new Error(`Anthropic returned an empty response (model ${config.model})`);
      }
      return { text, provider: 'anthropic', model: config.model };
    },
  };
}
