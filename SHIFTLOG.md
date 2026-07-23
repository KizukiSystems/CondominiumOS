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
