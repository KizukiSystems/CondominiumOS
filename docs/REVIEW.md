# Human review guide — the five pre-build modules

Written 2026-07-23 so the overdue human review is a ~20-minute job. All five modules were built by Claude Code on 2026-07-23 and audited by an external AI reviewer the same day; **no human has read this code yet.** You are that step. Ratifying each module (or amending it) closes ROADMAP §3a's review column.

## See it all work first (5 minutes)

```
npm install
npm test          # 24 tests: citation invariant, ingest, demo-data hygiene
npm run demo      # inbox -> Prep Board Meeting -> cited agenda -> click a citation chip
npm run ingest -- fixtures/maple-court   # the file-drop CLI reading the seed corpus
npm run lint && npm run typecheck        # eslint + strict tsc, both clean
```

## Review order and what deserves human judgment

### 1. `src/citations/` — the invariant, executable (read first; it is the product's soul)
- `model.ts` + `engine.ts` (~150 lines). Is the rule set right: prose must cite or be exactly `[uncited — needs source]`; marker never mixed into prose; marker never itself cited; unknown source ids fail?
- `coverage.test.ts`: the regression test is shaped like the POC's real hallucination. Anything missing from the rule set?
- Known limit (annotated): the demo checks at item level; sentence-level enforcement arrives when generation produces claim-sized blocks (WP-1.3).

### 2. `src/ingest/` — universal manual ingest
- `ingest.ts`: metadata comes only from what files declare, never inferred. Is that the right line? (e.g. should a file's mtime ever count as a date? Currently: no.)
- Failure posture: warnings, never crashes, never silent drops. Check the multipart-email and scanned-PDF cases.
- **Open ratification: the `unpdf` dependency** (pure-JS PDF text extraction). Veto reverts .pdf to recognized-but-unparsed.

### 3. `src/llm/` — the one door to any model
- `adapter.ts`: config resolution, browser-context guard, strict JSON parsing (throws rather than silently returning `[]` — the POC defect).
- Judgment calls to confirm: Anthropic refusals throw an error (rather than returning something); empty responses throw; default models (`gemini-3.1-pro-preview`, `claude-opus-4-8`) live in code as defaults but are env-overridable.

### 4. Scaffold and config
- `.gitignore`: the lane separation. `data/`, `runs/`, `.env` can never be committed; verified by canary test at build time, but read it yourself — this is the confidentiality boundary.
- `package.json` scripts, `tsconfig.json` (strict), `eslint.config.js`, `.github/workflows/ci.yml`.

### 5. `src/ui/` — the ported demo
- `data/demoSeed.ts`: read the rewritten backgrounds and talking points against `fixtures/maple-court/seed-threads.json`. Every claim should trace to a source; the POC's fabrications were removed. Do any remaining phrasings overreach?
- `components/Agenda.tsx`: the "mark final" flow replaced the POC's fake publishing. Is the copy honest enough?
- `demoSeed.test.ts`: the hygiene test bans the real management company's name from `src/` and `fixtures/` forever.

## After reviewing

Record dispositions in SHIFTLOG.md (a one-line "reviewed, ratified as-is" or itemized amendments). Tracked follow-ups from the external review live in ROADMAP §3a's quality list and are not part of this review.
