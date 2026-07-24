# Concierge — Work Plan for Claude Code

**Status:** DRAFT / PROPOSED · 2026-07-23 · companion to [ROADMAP.md](ROADMAP.md)

Work packages (WPs) sized so each is one Claude Code session / one PR. Detailed through M1; sketched for M2/M3 because those depend on the Friday gate and Build Spec §6 ratification. Every WP obeys [CLAUDE.md](CLAUDE.md): propose don't execute, cite or mark `[uncited]`, never touch Lane B while closed.

**WP header key:** Lane · Depends on · Inputs · Definition of done.

---

## M0 — Salvage Pass

### WP-0.1 · Salvage pass on the AI Studio POC
- **Lane:** A · **Depends on:** open item #11 (cleared 2026-07-23) · **Status:** `[complete — ratified 2026-07-23]` — [SALVAGE.md](SALVAGE.md) v1.0 run on `KizukiSystems/Concierge-OG` @ `65a6017`; verdicts and §4 repair rules ratified by Tets same day. **M0 closed**
- **Inputs:** the Drive folder "concierge googleaistudio app code" (Tets must drop it where Claude Code can read it; this environment has no Drive access by default)
- **Tasks:** read the tree; sort every file into good-bones / hallucination-or-junk / already-superseded; write `SALVAGE.md` with a keep/rewrite/discard verdict per file and a stack recommendation (default stack in WP-1.1 stands unless the verdict overturns it)
- **Done when:** `SALVAGE.md` exists and Tets has disposed on the verdicts

## M1 — Demo build (Lane A: fictional Maple Court / OCSCC 742 only)

### WP-1.1 · Repo scaffold
- **Lane:** A · **Depends on:** WP-0.1 stack verdict (CONFIRMED); open item #10 (disposed: build lives in this repo, `CondominiumOS`). **Status:** `[core built 2026-07-23 — awaiting Tets's review]` as gate-invariant pre-build item 1 (ROADMAP §3a), on Tets's go of the same date. Done-when verified: clean cold install, `tsc --noEmit` passes, production build passes, dev server starts, `data/`/`runs/`/`.env` confirmed gitignored by canary test. Remaining in WP-1.1: the LLM adapter itself (pre-build item 2). Ports from `Concierge-OG` obey the SALVAGE.md §4 repair rules (ratified 2026-07-23): rename CMG to a fictional firm; Manager's Suggestion from manager input only, never model-assigned; citation coverage enforced by test with `[uncited — needs source]` fallback; publish = honest file export, no simulated actions
- **Tasks:** scaffold per Build Spec §4: TypeScript, React + Vite front end, thin Node layer for the pipeline, local-first, no hosted backend. Layout: `spec/`, `fixtures/maple-court/` (committed), `data/` (gitignored, with committed `data/README.md` stating why), `src/ingest/ src/classify/ src/agenda/ src/llm/ src/ui/`, `runs/` (gitignored for Lane B runs). All LLM access behind one adapter (`src/llm/adapter.ts`): default provider Gemini API, Anthropic API as drop-in alternative, no provider calls outside the adapter, keys via `.env` never committed
- **Done when:** repo installs and runs clean from cold; lint/typecheck pass; `data/` and `.env` verified gitignored

### WP-1.2 · Fictional Maple Court corpus
- **Lane:** A · **Depends on:** WP-1.1 · **Status:** `[corpus v2 merged 2026-07-24]` — corpus v1 (47 generated messages, 2026-07-23, "start fresh, generate our own messy email stuff") merged with the ratified Notion mock database (93 messages) into one fixture: `fixtures/maple-court/corpus.json`, 140 messages / 50 threads over Feb-May 2026, five anchor storylines + routine noise, ground-truth labels in `labels.json`. Remaining for done: governing documents so legal context is citable; retarget if the gate names a different wedge
- **Tasks:** author ~15-25 fictional source docs as fixtures (emails, a prior-minutes doc, a reserve-study notice) that ground the Design Kit's five agenda items: (1) garage membrane repair, two quotes $42k/$51k, one flags a possible structural issue → "recommend engineer" flag; (2) noise / suspected short-term rental (Unit 504 re: 511); (3) reserve fund study due this fiscal year; (4) EV charger request (Unit 210), no policy yet; (5) arrears, two units 60+ days. Every fixture is plainly fictional; no real names, buildings, or Corporation 94 details
- **Amendment 2026-07-24 · corpus source and delivery (ratified by Tets in session):** the corpus is the "CondominiumOSMockDatabase01" Notion mock database, adopted whole (93 messages, 33 threads; lane-checked and ingest-verified in SHIFTLOG Shift 007). Supersedes the ~15-25 doc sizing above (from Build Spec §3/M1). Delivery is via a **swappable corpus container** (Tets builds it): the fixture corpus sits behind a container boundary so the mock database can be swapped out without touching pipeline code. The port lands when the container exists; until then the Notion database remains the source of truth and the Shift 007 mapping (From→sender, Date→date, Subject→subject, Body→body) is the port spec.
- **Amendment 2026-07-24 (second session) · corpus merge (directed by Tets in session):** the corpus v1 fixture and the mock database are MERGED rather than one superseding the other (Tets: "I would rather merge them"). `scripts/merge-corpus.ts` converts the 93 mock-database rows per the Shift 007 mapping and reconciles overlaps under the ratified rule that the six cited anchor facts win (edits enumerated in the script; corpus v1 byte-identical, sha-checked). This resequences the amendment above: the port has landed ahead of the container, directly in the flat fixture `[grounded — this PR]`. Unchanged: the swappable corpus container remains Tets's planned build (the fixture moves behind it when it lands), and the Notion database remains the source of truth for the mock-database rows (the conversion is re-runnable from a fresh export). Ratification vehicle for this amendment is the PR that carries it `[open — Tets merges to ratify]`
- **Done when:** each of the five agenda items is fully derivable from fixtures alone, with enough distractor emails that classification is non-trivial

### WP-1.3 · Pipeline
- **Lane:** A · **Depends on:** WP-1.1, WP-1.2
- **Tasks:** implement ingest → classify (work taxonomy: owner requests · contractor coordination · CMG · board · vendor · other) → cluster into candidate agenda items → generate pack → render. Implement the v0 data model: Corporation, Meeting, SourceDoc, AgendaItem, Option, Citation, Flag (type: caution | needs-professional). Enforce the invariant in code and test: no AgendaItem, background sentence, or Option without at least one Citation; uncitable generation emits `[uncited — needs source]`
- **Amendment 2026-07-24 · triage report (ratified by Tets in session):** classify emits a per-run **triage report**: one disposition line per ingested SourceDoc, either `included → candidate agenda item N` or `set aside`, each with a one-line reason. Every ingested doc appears exactly once; nothing is dropped silently. Rationale: the failure mode of a filter is silent omission; the manager must see what was excluded and why before trusting the agenda. One artifact, two consumers: the WP-1.4 visibility view and the eval harness below.
- **Amendment 2026-07-24 · classification eval harness (ratified by Tets in session):** classification is scored, not eyeballed. Evaluate triage dispositions against the mock database's ground-truth labels (`Topic tag`, 13 values; `Needs board decision`, 28 of 93 true; mapping documented in SHIFTLOG Shift 007), reporting precision/recall via an automated check. Labels ride in a sidecar fixture keyed by doc id, not inside `SourceDoc` (ingest model unchanged: nothing inferred, nothing added).
- **Done when:** running the pipeline on the fixtures yields the 5-item agenda with 100% citation coverage, verified by an automated check · *amended 2026-07-24:* plus a complete triage report (every ingested doc has a disposition and reason) and the classification eval reporting precision/recall against the labeled corpus

### WP-1.4 · Hero screen UI
- **Lane:** A · **Depends on:** WP-1.3
- **Tasks:** single hero screen per the Design Kit: a draft board agenda, each item showing a one-line decision summary, short background with a small inline citation chip ("source: Rideau Roofing, Apr 12"), and 2-3 option cards with one subtly marked "Manager's suggestion." Garage item shows a calm amber "Recommend engineer before deciding" flag. Design direction: quiet confidence; generous whitespace; tight type scale; one restrained accent color for actions; neutral grays for structure; amber (not red) for caution; citation chips present but understated; serif/editorial headings, clean sans body; reads like a well-made document, not enterprise software
- **Amendment 2026-07-24 · "set aside this run" view (ratified by Tets in session):** the hero screen gains a collapsible, understated section (collapsed by default) rendering the triage report's exclusions with reasons. The manager can pull an item back into consideration; the override is the human's decision, recorded so M3 can learn from it.
- **Done when:** the feeling test passes: a busy manager glancing at the agenda knows, per item, what the decision is and what the options are, within seconds per item · *amended 2026-07-24:* and the feeling test extends to triage: the manager can skim what was set aside and why in seconds, and reverse any exclusion

### WP-1.5 · Demo hardening
- **Lane:** A · **Depends on:** WP-1.4
- **Tasks:** `npm run demo` gives a cold user the 5-item Maple Court agenda in the browser; every claim carries a working citation chip (click → source); regeneration deterministic enough to demo live; citation-coverage check runs as a test, not a style
- **Done when:** M1 done-criteria met end-to-end from a fresh clone

**M1 stretch (propose before building, per CLAUDE.md rule 4):** citation side panel (chip → full source email), the "before" cluttered-inbox contrast view, per-item approval controls with a "Send to board" action locked until every item is approved, talking-points view. These come from the Design Kit iteration sequence; they are not M1 done-criteria.

## M2 — Pilot ingest · **Lane B · CLOSED**

> Gate: Build Spec §6 ratified + wedge confirmed + CMG/IP posture provisionally clear. Until then Claude Code refuses these tasks with a pointer to §6. Sketch only:

- **WP-2.1** · §6 ratification support: draft the data-handling contract for Tets's decision session (where real data lives: target local disk only, encrypted at rest; what if anything goes to a third-party LLM, which provider, what redaction: names/units → tokens; retention and per-run purge; whose consent is on file: Isaac, board/corporation where required, CMRAO confidentiality respected). Drafting the contract text is Lane A writing work; **applying** it to real data is Lane B
- **WP-2.2** · Redaction step + run log (ingest = manual file drop: exports, forwarded .eml/.txt, transcripts; never account access)
- **WP-2.3** · Real pack generation + side-by-side "his prep vs generated prep" comparison view
- **Done when (M2):** one real board-prep pack generated, reviewed by Isaac, edit-rate captured

## M3 — Feedback loop · Lane B · sketch

- **WP-3.1** · Capture Isaac's edits as structured diffs
- **WP-3.2** · Metrics: citation coverage, edit rate, time-to-prep vs his baseline
- **Done when (M3):** two consecutive real packs with metrics logged

---

## Sequencing at a glance

```
[input #11] → WP-0.1 ──(stack verdict)──→ WP-1.1 → WP-1.2 → WP-1.3 → WP-1.4 → WP-1.5
                                              ↑ (may start on Tets's go)
Friday gate + §6 ratified ═══════════════════════════════════════► WP-2.1..2.3 → WP-3.1..3.2
```

*Amendments require Tets's ratification.*
