# src/llm/ — the one door to any model

Queued: gate-invariant pre-build item 2 (ROADMAP §3a). Will contain `adapter.ts`: a single interface with Gemini as the default provider and Anthropic as a drop-in alternative. No provider calls are permitted anywhere outside this directory; model choice is config, not code; keys come from `.env` only.
