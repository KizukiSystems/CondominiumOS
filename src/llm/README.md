# src/llm/ — the one door to any model

Built 2026-07-23 (gate-invariant pre-build item 2, ROADMAP §3a). No provider calls are permitted anywhere outside this directory; the UI never touches a provider (the adapter throws if imported in a browser context).

- `adapter.ts` — the single public entry: `getAdapter()` resolves provider/model/key from the environment and returns an `LlmAdapter` with one method, `generate()`. Also exports `parseJsonResponse()` (throws on bad JSON; silent-empty was a POC defect, SALVAGE.md §3).
- `providers/gemini.ts` — default provider, via `@google/genai`. Default model `gemini-3.1-pro-preview` (carried from the POC).
- `providers/anthropic.ts` — drop-in alternative, via `@anthropic-ai/sdk`. Default model `claude-opus-4-8`. Refusals surface as errors, never as empty prose.

Configuration is environment only (model choice is config, not code):

| Variable | Values | Default |
| :--- | :--- | :--- |
| `LLM_PROVIDER` | `gemini` \| `anthropic` | `gemini` |
| `LLM_MODEL` | any model id | provider default |
| `GEMINI_API_KEY` / `ANTHROPIC_API_KEY` | from `.env`, never committed | — |

Verify wiring with `npm run llm:smoke` (offline: config + key presence) or `npm run llm:smoke -- --live` (one tiny real call).
