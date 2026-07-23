// The one door to any model (Build Spec §4 / WP-1.1).
// No provider calls are permitted anywhere outside src/llm/.
// Node-side only: keys come from process.env, never from browser code.

export type LlmProvider = 'gemini' | 'anthropic';

export interface LlmConfig {
  provider: LlmProvider;
  model: string;
  apiKey: string | undefined;
}

export interface LlmRequest {
  /** System / role framing for the call. */
  system?: string;
  /** The user-turn prompt. */
  prompt: string;
  /** Ask the provider for JSON output. Schema is advisory where supported. */
  json?: { schema?: Record<string, unknown> };
  /** Hard output cap. Defaults to 16000. */
  maxTokens?: number;
}

export interface LlmResponse {
  text: string;
  provider: LlmProvider;
  model: string;
}

export interface LlmAdapter {
  readonly config: LlmConfig;
  generate(request: LlmRequest): Promise<LlmResponse>;
}

export const DEFAULT_MODELS: Record<LlmProvider, string> = {
  // Default provider per Build Spec §4; model carried over from the POC.
  gemini: 'gemini-3.1-pro-preview',
  // Anthropic drop-in alternative.
  anthropic: 'claude-opus-4-8',
};

export const DEFAULT_MAX_TOKENS = 16000;

/**
 * Resolve provider/model/key from the environment.
 * LLM_PROVIDER: 'gemini' (default) | 'anthropic'
 * LLM_MODEL: overrides the provider's default model (model choice is config, not code)
 */
export function resolveLlmConfig(env: NodeJS.ProcessEnv = process.env): LlmConfig {
  const raw = (env.LLM_PROVIDER ?? 'gemini').toLowerCase();
  if (raw !== 'gemini' && raw !== 'anthropic') {
    throw new Error(`LLM_PROVIDER must be 'gemini' or 'anthropic', got '${raw}'`);
  }
  const provider = raw as LlmProvider;
  return {
    provider,
    model: env.LLM_MODEL || DEFAULT_MODELS[provider],
    apiKey: provider === 'gemini' ? env.GEMINI_API_KEY : env.ANTHROPIC_API_KEY,
  };
}

export async function getAdapter(env: NodeJS.ProcessEnv = process.env): Promise<LlmAdapter> {
  if (typeof window !== 'undefined') {
    throw new Error('The LLM adapter is server-side only; the UI must call the pipeline, never a provider.');
  }
  const config = resolveLlmConfig(env);
  if (!config.apiKey) {
    const keyName = config.provider === 'gemini' ? 'GEMINI_API_KEY' : 'ANTHROPIC_API_KEY';
    throw new Error(`${keyName} is not set. Copy .env.example to .env and fill it in.`);
  }
  if (config.provider === 'gemini') {
    const { createGeminiAdapter } = await import('./providers/gemini');
    return createGeminiAdapter(config);
  }
  const { createAnthropicAdapter } = await import('./providers/anthropic');
  return createAnthropicAdapter(config);
}

/**
 * Parse a JSON response body, tolerating markdown code fences.
 * Throws (rather than silently returning []) so callers must decide what a
 * failed generation means; silent-empty was a POC defect (SALVAGE.md §3).
 */
export function parseJsonResponse<T>(text: string): T {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  return JSON.parse(trimmed) as T;
}
