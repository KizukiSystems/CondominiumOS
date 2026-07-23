# src/citations/ — the citation engine (the invariant, executable)

Built 2026-07-23 (gate-invariant pre-build item 3, ROADMAP §3a). Enforces the Build Spec §2 data-model invariant: no generated claim without at least one Citation; generation that cannot cite emits `[uncited — needs source]` instead of prose. Coverage is a test, not a style.

- `model.ts` — `Citation`, `CitedBlock` (one claim-sized unit of prose + its citations), `UNCITED_MARKER`, violation and report types. Wedge-agnostic: any workflow that produces cited claims from source documents checks the same way.
- `engine.ts` — `checkCoverage(blocks, knownSourceIds)` returns a report; `assertCoverage(...)` throws with a readable report (the pipeline's hard runtime gate); `splitSentences()` utility for claim-sizing prose.
- `coverage.test.ts` — the build gate (`npm test`). Includes a regression test shaped like the POC's real hallucination (a recommendation citing a source that does not exist, SALVAGE.md §4).

Rules enforced: prose without citations fails; citations to unknown source ids fail; the marker replaces prose entirely (never mixed in, never itself cited); empty blocks fail. The pipeline (WP-1.3) must produce blocks at claim granularity and call `assertCoverage` before rendering anything.

Layout note: this directory is an addition to the Build Spec §4 layout (`ingest/classify/agenda/llm/ui`), proposed because citation enforcement is cross-cutting, not wedge-specific. Flagged for Tets's review in SHIFTLOG Shift 004.
