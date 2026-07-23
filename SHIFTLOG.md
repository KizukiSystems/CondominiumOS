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
