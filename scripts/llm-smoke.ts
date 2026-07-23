// Smoke-test the LLM adapter without touching the network by default.
//   npm run llm:smoke           -> config resolution + key presence only
//   npm run llm:smoke -- --live -> one tiny real call through the adapter
import { getAdapter, resolveLlmConfig } from '../src/llm/adapter';

try {
  process.loadEnvFile('.env');
} catch {
  // no .env is fine; keys may come from the environment or be absent
}

const live = process.argv.includes('--live');

async function main() {
  const config = resolveLlmConfig();
  console.log(`provider: ${config.provider}`);
  console.log(`model:    ${config.model}`);
  console.log(`api key:  ${config.apiKey ? 'present' : 'MISSING (set it in .env)'}`);

  if (!live) {
    console.log('offline check complete. Run with --live for a real call.');
    return;
  }
  const adapter = await getAdapter();
  const response = await adapter.generate({
    prompt: 'Reply with the single word: ok',
    maxTokens: 256,
  });
  console.log(`live response (${response.provider}/${response.model}): ${response.text.trim()}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
