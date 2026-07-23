# Concierge — Shift Log

Per-session record for shift-start reconciliation (MET-009) and lineage. Every working session (Claude Code or otherwise) appends an entry; the next shift starts by reading the newest entry, reconciling it against `git log` and the repo state, and only then taking new work.

**Rules**

- Newest entry first. One entry per session.
- Entries are immutable once committed; corrections go in a later entry, not by rewriting history. Amendments to prior entries require Tets's ratification (per CLAUDE.md).
- Verify before writing: commit SHAs, file lists, and claims come from `git log` and the working tree, not recollection.
- Format per CLAUDE.md: answer-first, scannable, status tags on load-bearing claims, no em dashes.

**Entry template**

```
## Shift NNN — YYYY-MM-DD · <session/builder>
- Scope requested:
- Work completed: (commits with SHAs and one-line substance)
- Decisions proposed vs ratified:
- Discoveries / flags:
- Open items and blockers (created or cleared, with ROADMAP ledger #s):
- Next-shift pointers:
```

---

## Shift 002 — 2026-07-23 · Claude Code (branch `claude/project-status-check-ja97bb`)

- **Scope requested:** (1) project status check against README and the shift log; (2) review the uploaded "CondominiumOS: A Foundations-First Repo Scouting Report"; (3) commit the SOURCES.md index entry and this log entry.
- **Work completed** `[grounded — see git log]`:
  - Shift-start reconciliation (MET-009): Shift 001 entry verified against `git log`; all three commits present, no drift.
  - Review of the scouting report delivered in-session (chat); verdict: solid license-aware research, filed as Phase 2+ reference, not adopted for M1.
  - `6fce40a` SOURCES.md index entry for the report: reference-only scope, stack conflict noted, not-adopted marker.
- **Decisions proposed vs ratified:**
  - Ratified by Tets this session: index the report in SOURCES.md as Phase 2+ reference; M1 default stack (Build Spec §4: TypeScript, React + Vite, thin Node pipeline) stands, report's Python + dlt + dbt + Postgres recommendation not adopted (no-silent-rewrites rule; trust beats recency).
  - Proposed, pending Tets: whether the report's "Python platform builder" premise reflects a deliberate second track or researcher drift; if a real track, add a ledger item. SALVAGE.md verdicts and ledger #10 (repo home) remain pending from Shift 001.
- **Discoveries / flags:**
  - The report answers a platform question (generic CondominiumOS data foundations) not the wedge question (Concierge board prep). Its Stage 0 plan (Postgres + condo mixins, week 1) conflicts with the phase model pre-gate.
  - Harvest map from the review: now, license cheat-sheet (copy-safe: condo MIT, dlt/dbt/Supabase Apache-2.0, Temporal MIT; re-verify at adoption). M2 design: append-only audit/run-log hybrid pattern. M2+: condo schema mixins (uuided/versioned/tracked/softDeleted, `*Change` tables; KeystoneJS, ports to the TS stack). Phase 2+ only: Supabase RLS multi-tenancy, admin UIs, Temporal.
  - All of the report's external claims (licenses, versions, stars) are cited but unverified in-session `[open]`; verify LICENSE files at adoption time.
- **Open items and blockers:**
  - Created: none committed (Python-track ledger item proposed only).
  - Still blocked: ledger #11 (AI Studio code folder, blocks M0 completion); ledger #1-#9 keyed to the Fri 2026-07-24 gate meeting (tomorrow); Lane B closed (Build Spec §6 unratified).
  - Cleared: none.
- **Next-shift pointers:**
  1. Reconcile this entry against `git log` (MET-009). Note: Shift 002 work is on branch `claude/project-status-check-ja97bb`, which started from the tip of Shift 001's branch.
  2. Shift 001 pointers stand: POC code folder → finish M0; Friday outcomes → ROADMAP §2 and the ledger; M1 scaffold on Tets's explicit go.
  3. If any scouting-report component is ever adopted, re-verify its license first and record the adoption as a ratified decision, not a silent one.

## Shift 003 — 2026-07-23 · Claude Code (branch `main`; same conversation as Shift 002, logged separately because M0 scope opened mid-session)

- **Scope requested:** Tets synced the AI Studio POC to GitHub as `KizukiSystems/Concierge-OG` and provided the link; finish M0 per SALVAGE.md §6.
- **Work completed** `[grounded — see git log]`:
  - Cloned `Concierge-OG` @ `65a6017` (sole commit, 23 files, ~1,650 lines TS/TSX); read every file; verified `tsc --noEmit` and production build both pass.
  - SALVAGE.md v1.0: full per-file keep/rewrite/discard verdicts, hallucination/canon check, stack recommendation upgraded to CONFIRMED `[grounded]` (the POC already is the Build Spec §4 stack). Summary: good bones; ~60% survives into M1, mostly the UI layer; pipeline layer needs rewrite behind the adapter; AI Studio harness, CMG-branded surfaces, and simulated-autonomy theater discarded.
  - WORKPLAN WP-0.1 → `[complete — awaiting disposition]`; ROADMAP ledger #11 → cleared.
- **Decisions proposed vs ratified:**
  - Ratified by Tets this session: none new (branch consolidation was ratified earlier, see Shift 002 addendum).
  - Proposed, pending Tets: all SALVAGE.md v1.0 verdicts (§3) and the four invariant-repair requirements for any port (§4). M0's done-when needs Tets's disposition.
- **Discoveries / flags:**
  - **CMG (the real management company) is named inside the fictional demo** (CMGReports.tsx, nav, a mock `@cmg.com` email, a publish step). Rule 6 violation in any port; rename to a fictional firm.
  - **The POC has the LLM invent the Manager's Suggestion and advice-flavored talking points**, including one true hallucination (recommends "Cardinal Engineering" for the structural slab review; Cardinal is the reserve-fund firm; no structural firm exists in the sources) and uncited claims ($500k failure figure, ~15% market-rate rise). Exactly the failure modes the citation and no-advice invariants exist to catch.
  - The publish flow simulates autonomous actions (calendar invites, portal sync); must become an honest export.
  - Fixture content is canon-faithful: all six required sources exact, plus two useful distractors. "31 messages across 8 threads" confirmed hard-coded (corpus is 8 single-message threads).
- **Open items and blockers:**
  - Cleared: ledger #11.
  - Still open: Tets's disposition on SALVAGE v1.0 (closes M0); ledger #10 (build home; `Concierge-OG` is reference-only, not the build repo); ledger #1-#9 keyed to the Fri 2026-07-24 gate; Lane B closed.
- **Next-shift pointers:**
  1. Reconcile against `git log` (MET-009). Canon line is `main`.
  2. On Tets's disposition of SALVAGE v1.0: M0 closes; WP-1.1 scaffold may start on explicit go (gate outcome permitting), lifting the §6 list from the POC.
  3. Friday-gate pointers from Shift 001 stand.

## Session close — 2026-07-23 · Claude Code · consolidated summary of Shifts 002-004 (one conversation)

Written at Tets's request as the single reconciliation point for the next shift. Detail lives in the Shift 002-004 entries and addenda below; this entry is the map. All claims verified against `git log` and a final test run (24/24 passing) `[grounded]`.

- **Where things stand:** M0 CLOSED (ratified). Canon line is `main` at `3c87457`, 15 commits, one linear history. Gate-invariant pre-build queue (ROADMAP §3a) COMPLETE: all 5 items built the same day, each awaiting Tets's code review but ratified to build. Lane B closed. Wedge code (WP-1.2 corpus, WP-1.3 pipeline, agenda semantics) deliberately unbuilt pending the Fri 2026-07-24 gate meeting with Isaac.
- **The session's work, in commit order:**
  1. `6fce40a` `d96d61b` scouting report reviewed and filed as Phase 2+ reference, not adopted (Shift 002).
  2. `691733a` branches consolidated into `main` (Shift 002 addendum).
  3. `8c02178` M0 salvage pass completed on `Concierge-OG` @ `65a6017`; SALVAGE.md v1.0 (Shift 003).
  4. `09b1b3e` Tets's dispositions recorded: SALVAGE ratified, M0 closed, build home = this repo, four port repair rules binding (Shift 003 addendum).
  5. `4b36533` pre-gate intel logged to ledger #1-#6; ingest ratified universal + manual for v0.x (Shift 003 addendum 2).
  6. `88e7201` pre-build 1: repo scaffold (React 19 + Vite + Tailwind + strict TS; lane separation in .gitignore, canary-tested) (Shift 004).
  7. `4e52249` pre-build 2: LLM adapter, Gemini default / Anthropic drop-in, no provider calls outside `src/llm/`.
  8. `2d5af20` pre-build 3: citation engine + coverage test; the invariant is now executable and build-failing.
  9. `d02f2f3` pre-build 4: universal manual ingest (txt/md/eml/json/pdf), warnings never silent drops.
  10. `3c87457` pre-build 5: UI kit ported with all four repair rules applied; seed corpus committed; cached demo data repaired against the citation invariant; queue complete.
- **Ratified by Tets this session:** merge to `main`; SALVAGE v1.0 verdicts; M0 closure; build home (ledger #10); repair rules; scouting-report disposition (drift, keep as reference); ingest universal + manual; building pre-build items 1-5; `src/citations/` layout addition.
- **Still open for Tets:** code review of the five pre-build items; `unpdf` dependency ratification; GitHub housekeeping (default branch → `main`, delete the two `claude/*` branches).
- **Next shift, in order:**
  1. Reconcile this entry against `git log` (MET-009).
  2. Ingest the Friday gate outcomes: update ROADMAP §2 outcome branch, ledger #1-#9, Discovery Log statuses. If a different wedge is named, retarget WP-1.x before any code (Agenda's five-category structure and `src/agenda/` rename freely; everything else is wedge-proof).
  3. On wedge confirmation + Tets's go: WP-1.2 (expand `fixtures/maple-court/` to ~15-25 docs including governing documents, so legal context becomes citable) then WP-1.3 (pipeline: ingest → classify → generate → `assertCoverage` → render; wire `npm run demo` end to end).
  4. Build Spec §6 drafting starts when the meeting yields the data-handling facts; Lane B stays closed until ratified.

## Shift 004 addendum 4 — 2026-07-23 · same session (pre-build item 5: UI kit port; queue complete)

- Tets ratified starting item 5 ("let's go on 5").
- **Work completed** `[grounded — verified this session]`:
  - Ported from `Concierge-OG` with repair rules applied: Layout (CMG nav and dead links cut, honest footer), Inbox, DocumentsList, Agenda (publish theater replaced by a local "mark final" freeze that states nothing was sent; provenance banner computed from the corpus, replacing the hard-coded "31 messages across 8 threads"), CitationPanel (dead portal button cut). `motion` dependency not ported (CSS only).
  - `fixtures/maple-court/seed-threads.json` committed: the 8 seed threads, valid both as the demo UI's data and as `npm run ingest` input. First entries of the WP-1.2 corpus.
  - **Cached demo data repaired against the citation invariant**: the POC's uncited claims ($500k failure figure, ~15% market rates, lien "tight window", invented engineer pricing) and unsourced legal context (30-day rental rule, Act deadlines) removed or rewritten to what the 8 sources support; the Cardinal-for-structural hallucination gone. Legal context returns with WP-1.2 cited to governing docs.
  - Tests added (4): cached data passes `checkCoverage` against the seed corpus; citation display fields match their sources; exactly one Manager's Suggestion per item; a repo hygiene test asserting the real management company's name appears nowhere under `src/` or `fixtures/`.
  - Fictional email domains switched to reserved `.example` style copy where they appeared (real-looking `.ca`/`.com` domains cut).
- Verified: typecheck, full suite (24 tests), production build, dev server all pass. `npm run demo` now shows the working flow: inbox → prep → cited agenda → citation chip → source panel → mark final.
- ROADMAP §3a items 1-5 all `[built — awaiting Tets's review]`. **The gate-invariant pre-build queue is complete.** Remaining before wedge code: the Friday gate outcomes, then WP-1.2 corpus + WP-1.3 pipeline on Tets's go.

## Shift 004 addendum 3 — 2026-07-23 · same session (pre-build item 4: universal manual ingest)

- Tets ratified item 3's layout proposal (`src/citations/` approved) and starting item 4 ("approved. go on 4").
- **Work completed** `[grounded — verified this session]`: `src/ingest/model.ts` (SourceDoc: slug id as citation target; sender/date/subject only as declared by the source, never inferred), `src/ingest/ingest.ts` (recursive deterministic walk; parsers for txt/md header-sniff, eml with folded headers + multipart warning, json thread export matching the POC shape, pdf via `unpdf`; warnings instead of silent drops), `src/ingest/ingest.test.ts` (8 tests), `scripts/ingest.ts` + `npm run ingest -- <folder>` CLI.
- Verified: typecheck, full suite (20 tests), production build, and a live CLI run on a scratch drop folder all pass.
- **Proposed, pending Tets** `[open]`: new dependency `unpdf` (pure-JS PDF text extraction, no native code) for the .pdf format. Veto reverts .pdf to recognized-but-unparsed.
- No-fabrication note: ingest never invents metadata; PDFs with no extractable text warn rather than pretending to be empty-but-fine.
- ROADMAP §3a item 4 → `[built — awaiting Tets's review]`. Last in queue on Tets's go: item 5, the de-CMG'd UI kit port (~90% gate-safe).

## Shift 004 addendum 2 — 2026-07-23 · same session (pre-build item 3: citation engine)

- Tets ratified starting item 3 ("go on 3").
- **Work completed** `[grounded — verified this session]`: `src/citations/model.ts` (Citation, claim-sized CitedBlock, `[uncited — needs source]` marker, violation/report types), `src/citations/engine.ts` (`checkCoverage`, `assertCoverage` as the pipeline's hard runtime gate, `splitSentences`), `src/citations/coverage.test.ts` (12 tests, wired as `npm test` via vitest).
- Rules now executable: uncited prose fails; citations to nonexistent sources fail (regression test shaped like the POC's Cardinal Engineering hallucination, SALVAGE.md §4); the marker replaces prose entirely, never mixed in, never itself cited; empty blocks fail.
- Verified: typecheck, all 12 tests, and production build pass.
- **Proposed, pending Tets** `[open]`: `src/citations/` is an addition to the Build Spec §4 directory layout (`ingest/classify/agenda/llm/ui`); placed there because citation enforcement is cross-cutting, not wedge-specific. Ratify or direct a merge into another directory.
- ROADMAP §3a item 3 → `[built — awaiting Tets's review]`. Next on Tets's go: item 4, universal manual ingest.

## Shift 004 addendum — 2026-07-23 · same session (pre-build item 2: LLM adapter)

- Tets ratified starting item 2 after the scaffold ("go on 2").
- **Work completed** `[grounded — verified this session]`: `src/llm/adapter.ts` (single entry: `getAdapter()`, env-resolved config, browser-context guard, strict `parseJsonResponse`), `providers/gemini.ts` (`@google/genai`, default `gemini-3.1-pro-preview`, JSON mode + schema), `providers/anthropic.ts` (`@anthropic-ai/sdk`, default `claude-opus-4-8`, structured output via `output_config`, refusals throw), `scripts/llm-smoke.ts` + `npm run llm:smoke` (offline config check; `--live` flag for a real call).
- Verified: typecheck and production build pass with the SDKs installed; smoke test resolves both providers and rejects bad `LLM_PROVIDER`. Live call not run (no keys in this environment, by design).
- Invariants honored: no provider calls outside `src/llm/`; keys via `.env` only; model choice is config; empty/refused responses throw instead of silently returning `[]` (the POC defect).
- ROADMAP §3a item 2 → `[built — awaiting Tets's review]`. Next in queue on Tets's go: item 3, the citation engine + coverage test.

## Shift 004 — 2026-07-23 · Claude Code (branch `main`; same conversation, new work block: first code in the repo)

- **Scope requested:** Tets asked what could be built that no Friday outcome invalidates; ratified building item 1 (repo scaffold) with review after, and putting items 2-5 on the roadmap as a queue.
- **Work completed** `[grounded — verified this session]`:
  - WP-1.1 core scaffold at repo root: package.json (React 19, Vite 6, Tailwind 4, TS strict), `src/ui/` placeholder screen in the quiet-confidence theme, `src/llm|ingest|classify|agenda/` stub READMEs stating each directory's contract, `spec/`, `fixtures/maple-court/` (corpus rules), `data/README.md` (Lane B rules), `.env.example`, `.gitignore` enforcing lane separation.
  - Verified: clean cold install; `tsc --noEmit` passes; production build passes; `npm run demo` dev server starts; canary test confirms `data/*`, `runs/`, `.env` are ignored while `data/README.md` stays committed.
  - ROADMAP §3a added: gate-invariant pre-build queue (1 built, 2-5 queued: adapter, citation engine + coverage test, universal ingest, UI kit port).
- **Decisions proposed vs ratified:**
  - Ratified by Tets: build pre-build item 1 now; queue items 2-5 on the roadmap; review before item 2 starts.
  - Proposed, pending: the scaffold itself awaits Tets's review; `src/agenda/` keeps its wedge name until the gate (renames freely).
- **Discoveries / flags:** none; no canon conflicts. No LLM calls exist in the repo yet; the citation invariant binds from the first generated claim (pre-build item 3 exists to enforce it).
- **Open items and blockers:** unchanged from Shift 003 addendum 2. The gate meeting (Fri 2026-07-24) remains the critical path; Lane B closed.
- **Next-shift pointers:**
  1. Reconcile against `git log` (MET-009); canon line is `main`.
  2. Tets reviews the scaffold; on his go, pre-build item 2 (LLM adapter).
  3. After the gate: feed outcomes into ROADMAP §2 and the ledger; corpus (WP-1.2) and agenda semantics unlock only then.

## Shift 003 addendum 2 — 2026-07-23 · same session (pre-gate intel from Tets)

- Tets provided pre-meeting answers by voice (transcript partly garbled; interpretation played back for correction). Ledger #1-#6 updated with tagged notes: wedge strongly signaled by Isaac's own past statements `[assumption]`; stack = Gmail + Drive + likely Asana `[assumption — Tets recall]`; ingest stays universal/manual for v0.x (ratified, matches existing invariant); CMG kept clear, personal-use posture, market = other property managers (provisional); Isaac likely IC, contract unread; data ownership pinned, fictional + public data interim.
- Unparsed transcript fragments flagged to Tets: opening phrase ("Lunchboxes..."), exact PM software name.
- Net effect on the gate: Friday narrows to confirming the wedge with Isaac directly, collecting the item #3 artifacts, the contract (#5), and the relationship items (#8, #9).

## Shift 003 addendum — 2026-07-23 · same session (dispositions received, M0 closed)

- Tets disposed on all four pending items this session `[grounded — Tets's message]`:
  1. SALVAGE.md v1.0 verdicts: **accepted as written**. M0 is complete and closed.
  2. The four port repair rules (rename CMG; Manager's Suggestion from manager input only; citation coverage as a test with `[uncited]` fallback; publish = honest export): **confirmed binding**. Recorded in WP-1.1.
  3. Ledger #10: **the build lives here in `CondominiumOS`** (supersedes Build Spec §4's `concierge` repo). `Concierge-OG` stays reference-only.
  4. Scouting report Python premise: **research drift, no second track**; report retained as reference for its framework, meta-patterns, and plumbing value. No new ledger item.
- Remaining before code: the Fri 2026-07-24 gate meeting outcomes, then Tets's explicit go on WP-1.1.

## Shift 002 addendum — 2026-07-23 · same session (branch consolidation)

- Ratified by Tets in-session: unify the two working branches into one canonical line. `main` created at the Shift 002 tip; `claude/roadmap-work-plan-design-e05cre` fast-forwarded to the same commit (it was a strict ancestor, no merge conflicts possible). `main` is canon going forward; the two `claude/*` branches are retirable.
- Shift 002's "two unmerged branches" housekeeping note is resolved by this. `[grounded — git log]`

## Shift 001 — 2026-07-23 · Claude Code (branch `claude/roadmap-work-plan-design-e05cre`)

- **Scope requested:** design and commit a roadmap and work plan from the 12 uploaded project documents; then run the M0 salvage pass ("POC code is in the uploads folder"); then create this shift log.
- **Work completed** `[grounded — see git log]`:
  - `1953aec` founding commit (repo was empty): README.md, CLAUDE.md (operating rules from Build Spec §7 + lanes + epistemic tags), ROADMAP.md (phase model, Friday gate with outcome branches, M0-M3, invariants, 11-item open ledger, success definition), WORKPLAN.md (WP-0.1 through WP-3.x with done criteria), docs/SOURCES.md (provenance index).
  - `30407a5` partial M0 salvage pass: SALVAGE.md v0.1; WP-0.1 marked `[partial]`; ROADMAP ledger #11 updated.
- **Decisions proposed vs ratified:**
  - Ratified by user this session: the roadmap plan itself and the shift-log plan (approved via plan mode).
  - Proposed, pending Tets: SALVAGE.md verdicts (Hero v1.1 KEEP; stack default stands); repo-home question (ledger #10, `CondominiumOS` vs `concierge`) untouched.
- **Discoveries / flags:**
  - The AI Studio POC **code tree is not in the uploads** `[grounded — full-disk search]`; uploads = 12 documents only.
  - `Concierge_Hero_v1.1.pdf` is a single-page Chrome print-to-PDF raster render of the hero screen, not code. Assessed in full: all five Design Kit agenda items present, quiet-confidence direction achieved. Verdict KEEP as design reference + WP-1.2 fixture seed.
  - Discrepancy for WP-1.2: hero banner claims "31 messages across 8 threads"; Build Spec M1 corpus is ~15-25 docs. Recommendation: computed banner count.
  - Fixture requirements extracted (sources the corpus must contain): Rideau Roofing Apr 12 · Capital Membrane Apr 18 · Unit 504 Apr 3 · Cardinal Eng. Apr 7 · Unit 210 Apr 9 · Accounts ledger Apr 30.
- **Open items and blockers:**
  - Created: none beyond the ledger as committed.
  - Still blocked: ledger #11 (AI Studio code folder needed to finish M0 per SALVAGE.md §6); ledger #1-#9 keyed to the Fri 2026-07-24 gate meeting; Lane B closed (Build Spec §6 unratified).
  - Cleared: none.
- **Next-shift pointers:**
  1. Start by reconciling this entry against `git log` (MET-009).
  2. If the AI Studio code folder has arrived: complete M0 per SALVAGE.md §6 (full tree listing, per-file verdicts, final stack recommendation), then await Tets's disposition.
  3. After the Friday meeting: feed outcomes into ROADMAP §2 (gate) and the open-items ledger; move Discovery Log items `[confirm]`/`[fuzzy]` → `[solid]` or strike them; if a different wedge is named, retarget WP-1.x before any code.
  4. M1 scaffold (WP-1.1) may start on Tets's explicit go, per Build Spec closing note.
