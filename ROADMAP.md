# Concierge — Roadmap

**Status:** DRAFT / PROPOSED · compiled 2026-07-23 (pre-gate) · Owner: Tetsuro Ide, Kizuki Systems Inc. · Builder: Claude Code
**Derived from:** Build Spec v0.1, Project Map, Cross-AI Context Map v0.2, Discovery Log, Isaac Meeting Briefing 2026-07-24, Design Kit, video digestion handoffs (see [docs/SOURCES.md](docs/SOURCES.md))
**Companion:** [WORKPLAN.md](WORKPLAN.md) (work packages) · [CLAUDE.md](CLAUDE.md) (operating rules)

## How to read this

This roadmap is written **before the gate**: the Fri 2026-07-24 meeting with Isaac has not happened yet. Lane A work (fictional data) is fully planned and actionable now. Lane B work (real data) is listed but explicitly blocked, with exact unblock conditions. Nothing here promises calendar timelines; the plan sequences work, it does not date it.

Status tags: `[seeded]` drafted · `[open]` not yet · `[blocked]` waiting on an input · `[grounded]` verified · `[assumption]` reasoned but unverified.

---

## 1 · Phase model (where we are)

| Phase | Question | Status |
| :--- | :--- | :--- |
| **Phase -1 — Foundations** | Does this even make sense? | Conceptual pillar `[seeded]`; relational pillar (partnership, IP, CMG) `[open]`/`[blocked]`; epistemic pillar `[seeded]` |
| **The Gate (-1 → 0)** | "I think" becomes "I've verified" | **Not passed.** Keyed to the Fri 2026-07-24 meeting (§2 below) |
| **Phase 0 — Definition** | What exactly are we building first? | Build Spec v0.1 drafted ahead of the gate `[seeded]`; wedge = board-meeting prep `[assumption pending Isaac's confirmation]` |
| **Phase 1 — Build the wedge** | PM-facing copilot for the one workflow | M0-M1 (Lane A) may start on Tets's go; M2+ gated |
| **Phase 2+ — Expand** | Adjacent workflows, board/resident surfaces, multiple buildings | Vision only. Board portal runs the Spawn-vs-Fold Test (MET-004) before becoming its own build |

## 2 · The Gate — Fri 2026-07-24 meeting with Isaac

Move -1 → 0 only when all three hold:

- [ ] Isaac confirms the thesis **and** lands on the wedge (or names a better one)
- [ ] Partnership foundation cleared enough to invest real hours (in/out, IP, CMG posture, at least provisionally)
- [ ] Load-bearing items in the discovery log move `[confirm]`/`[fuzzy]` → `[solid]`

**Outcome branches:**

| Friday outcome | What happens to this plan |
| :--- | :--- |
| **Wedge confirmed as board prep** | Proceed M0 → M1 as planned. Collect: sample agenda, his talking-points format, where source emails live, any CMG template (these shape the M1 output template and ingest formats). Fill Build Spec §6 toward ratification; M2 opens only after ratification. |
| **A different wedge named** | M1 retargets **before code**. Rework WORKPLAN WP-1.x around the named workflow; the invariants (§4) and lane rules carry over unchanged. |
| **Meeting stalls or postpones again** | Lane A continues (M0, and M1 on Tets's go). Lane B stays closed. Treat the postponement as live signal on the relational pillar (per Project Map: "are both of us actually in?"). |

**Win condition (from the briefing):** leave with one named workflow, an agreed 2-week test against his real work, and a bounded value-exchange. Drift into open-ended free work is the failure mode.

## 3 · Milestones (from Build Spec §3)

| Milestone | Lane | Substance | Done when |
| :--- | :--- | :--- | :--- |
| **M0 — Salvage Pass** (MET-008) | A | Read the AI Studio POC tree; sort into good-bones / hallucination-or-junk / already-superseded; produce `SALVAGE.md` with keep/rewrite/discard verdicts + a stack recommendation | `SALVAGE.md` exists and Tets has disposed on the verdicts |
| **M1 — Demo build** | A | Repo scaffold; fictional Maple Court corpus (~15-25 docs); pipeline ingest → classify → cluster → generate pack → render; single hero screen per the Design Kit | From `npm run demo`, a cold user gets the 5-item Maple Court agenda in the browser; every claim carries a working citation chip; regeneration deterministic enough to demo live |
| **M2 — Pilot ingest** | **B (gated)** | Manual file-drop ingest of real Corporation 94 material (never account access); redaction per §6; run log; side-by-side "his prep vs generated prep" view | One real board-prep pack generated, reviewed by Isaac, edit-rate captured |
| **M3 — Feedback loop** | B (gated) | Capture Isaac's edits as structured diffs; measure citation coverage, edit rate, time-to-prep vs his baseline | Two consecutive real packs with metrics logged |

Work-package decomposition lives in [WORKPLAN.md](WORKPLAN.md).

### 3a · Gate-invariant pre-build queue (ratified by Tets 2026-07-23)

Work that survives every Friday outcome because it follows from the §4 invariants, not the wedge. Sequenced; each item starts on Tets's go after review of the previous.

| Pre | Substance | Status |
| :--- | :--- | :--- |
| 1 | Repo scaffold (WP-1.1 core): stack, tooling, lane separation, directory layout | `[built 2026-07-23 — awaiting Tets's review]` |
| 2 | LLM adapter `src/llm/adapter.ts`: one interface, Gemini default, Anthropic drop-in, model as config | `[built 2026-07-23 — awaiting Tets's review]` |
| 3 | Citation engine + coverage test: cite or emit `[uncited — needs source]`; uncited output fails the build | `[built 2026-07-23 — awaiting Tets's review]` |
| 4 | Universal manual ingest: dropped files (.txt/.md/.eml/.pdf) → source-document model | `[queued]` |
| 5 | UI kit port from `Concierge-OG` with the SALVAGE §4 repair rules applied | `[queued — ~90% gate-safe; Agenda.tsx structure assumes board prep]` |

Deliberately NOT in this queue (waits for the gate): the Maple Court corpus (WP-1.2) and agenda-item semantics, which encode the wedge.

## 4 · Standing invariants (enforced non-goals, Build Spec §2)

- No board/resident-facing portal (Phase 2+; separate Spawn-vs-Fold decision)
- No CMG system integrations, no email-account OAuth in v0.x (ingest = files/exports only)
- No autonomous sending, filing, or actions of any kind (autonomy stays L0-L1: draft and propose)
- No advice generation (legal, financial, engineering); the tool surfaces sources and options, never recommendations beyond the labeled "Manager's suggestion" derived from the manager's own stated position
- No multi-building scaling work; one corporation at a time
- Data-model invariant: **no AgendaItem, background sentence, or Option without at least one Citation**; generation that can't cite emits `[uncited — needs source]` instead of prose

## 5 · Open items ledger (what each unblocks)

| # | Item | Status | Unblocks |
| :--- | :--- | :--- | :--- |
| 1 | Wedge confirmation (board prep, or a better one) | `[open — Friday]` · pre-gate signal (Tets, 2026-07-23): Isaac has already named board prep among his biggest time sinks and wants it off his plate `[assumption until Isaac confirms]` | M1 target lock; the gate |
| 2 | Isaac's real daily stack (email, accounting, doc store, PM software, real names) | `[open — Friday]` · known so far `[assumption — Tets recall]`: Gmail, Google Drive, likely Asana for PM. Decision (Tets, ratified 2026-07-23): v0.x ingest stays universal and manual (file drops/exports, no integrations); real-system integration is a later phase | M2 ingest formats |
| 3 | Sample agenda + talking-points format + where source emails live + CMG template | `[open — Friday]` · Tets expects these to be easy and quick to obtain | M1 output template |
| 4 | CMG posture: customer, blessing-giver, or kept clear of; read/write boundaries | `[provisionally set — Tets, 2026-07-23]`: keep CMG clear of this for now; tool is for Isaac's personal use; venture stays between Tets and Isaac; eventual market is other property managers, not CMG. Confirm with Isaac Friday | Hardens §4 non-goals; partnership posture |
| 5 | Employee vs IC, then read the CMG contract (IP assignment, confidentiality, non-solicit/non-compete) | `[open]` · likely independent contractor `[assumption — Tets recall]`; contract still unread, so IP posture stays unresolved | IP posture; Two-Layer Attribution log (MET-012) opens with the repo |
| 6 | Pilot data ownership (whose data is a real building's data; CMRAO confidentiality) | `[pinned — Tets, 2026-07-23]`: ownership unclear, deliberately parked; interim rule: fictional fixtures and public data only, which Lane A already enforces | Build Spec §6 ratification |
| 7 | Build Spec §6 data handling: where real data lives, what goes to which LLM with what redaction, retention/purge, consent on file | `[open — ratify before M2]` | **Lane B / M2 / M3** |
| 8 | Partnership terms: equity, time, money in, roles, decision rights | `[open]` | The gate (relational pillar) |
| 9 | Path to paid or a bounded value-exchange | `[open — Friday]` | Pilot framing |
| 10 | Repo home for the build | `[disposed 2026-07-23]` — Tets: build lives here in `CondominiumOS` (supersedes Build Spec §4's `KizukiSystems/concierge`); `Concierge-OG` stays reference-only | WP-1.1 scaffold location: this repo |
| 11 | AI Studio POC code folder made available to Claude Code | `[closed 2026-07-23]` — synced as `KizukiSystems/Concierge-OG`; [SALVAGE.md](SALVAGE.md) v1.0 ratified by Tets same day. **M0 complete** | M0: done |

## 6 · Definition of success (v0.x, Build Spec §9)

Isaac reviews a generated pack and says some version of: **"this is my prep, faster, and I can see where every line came from."**

Metrics: citation coverage 100% · his edit rate trending down across packs · time-to-prep materially below his baseline.

---

*Amendments require Tets's ratification. M0-M1 may start on his go; M2+ gated per Build Spec §0/§6.*
