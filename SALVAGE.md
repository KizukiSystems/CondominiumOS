# SALVAGE.md — M0 Salvage Pass (MET-008)

**Status:** v0.1 PARTIAL · 2026-07-23 · run by Claude Code · awaiting Tets's disposition
**Scope run:** everything available in this session's uploads. **The AI Studio code tree itself was not among the uploads**, so the per-file keep/rewrite/discard pass on "concierge googleaistudio app code" could not run. This document records verdicts on what was available and exactly what is needed to finish M0.

## 1 · What was searched `[grounded]`

- Uploads folder: 12 files, all project documents (PDF/MD). No source files, no archives, no code directories anywhere on disk (verified by filesystem search for code folders, archives, and `.tsx/.jsx` files).
- The only POC-derived artifact present: `Concierge_Hero_v1.1.pdf`, a single-page Chrome print-to-PDF containing one raster screenshot (2815×8377 px) of the rendered Maple Court hero screen.

## 2 · Verdicts on available artifacts

| Artifact | Verdict | Basis |
| :--- | :--- | :--- |
| **Concierge_Hero_v1.1 (rendered hero screen)** | **KEEP — as design reference and fixture seed, not as code** | Good bones throughout: matches the Design Kit direction closely (see §3). It is a raster render; there is no implementation to salvage from it. Use as the visual acceptance target for WP-1.4 and the content seed for WP-1.2. |
| **AI Studio code tree** ("concierge googleaistudio app code") | **NO VERDICT — not present** | Cannot sort into good-bones / hallucination-or-junk / already-superseded without the files. See §5. |
| **The 11 project documents** | Out of salvage scope | They are canon inputs, already indexed in [docs/SOURCES.md](docs/SOURCES.md); nothing to keep/discard. |

## 3 · Hero v1.1 assessment (the KEEP rationale) `[grounded — read from the render]`

What the render shows, and how it scores against the Design Kit:

- **Structure:** "DRAFT BOARD AGENDA · Maple Court · OCSCC 742 · 88 residential units · Ottawa"; meeting line (Thursday, May 8 2026, 7:00 PM, Party Room, 200 Maple Court Lane); provenance banner ("Drafted by Concierge from **31 messages across 8 threads**, April 1–30. Every item links to its source. Review before circulating."); "FIVE DECISIONS FOR THE BOARD"; footer "Prepared for board review · not yet circulated · Concierge."
- **All five Design Kit items present**, each with category label, decision-first serif headline, background with inline citation chips, and 2-3 option cards with one shaded "MANAGER'S SUGGESTION" and trade-off footers (price/time/qualifier):
  1. Maintenance: garage membrane (Rideau Roofing $42,000 recoat vs Capital Membrane $51,000 flagging possible slab deterioration; amber "Recommend engineer before deciding" chip; suggestion: commission a structural engineer, ~$2,500, 2-3 wks)
  2. Compliance: recurring noise at Unit 511 reported by Unit 504; 30-day rule; suggestion: formal warning letter
  3. Reserve fund: study update due; Cardinal Engineering renewal at $6,800 vs solicit three new quotes (~3 wk delay)
  4. Policy: EV charger request, Unit 210; suggestion: interim case-by-case policy at owner cost; alternatives: capacity study ~$3,500, defer to legal review
  5. Finance: Units 312 and 808 60+ days in arrears, $9,240 total; suggestion: payment plan then lien; alternatives: liens now, collections
- **Design language:** quiet confidence achieved. Serif editorial headlines, clean sans body, cream/neutral ground, single restrained navy accent, amber (not red) caution chip, understated citation chips, generous whitespace, no dense grids. The feeling test passes on read: each item's decision and options parse in seconds.
- **Judgment note `[assumption]`:** the option-card trade-off footers ("Balanced," "Firm," "Higher cost") skirt the no-advice invariant's edge but stay on the right side of it since the only marked recommendation is the Manager's Suggestion. Keep, but preserve this restraint in the build.

## 4 · Discrepancies for WP-1.2 to reconcile `[open — small]`

- Hero banner says **31 messages across 8 threads**; Build Spec §3 (M1) says a **~15-25 doc** fictional corpus. Author the corpus first, then make the banner count computed, not hard-coded.
- Hero cites sources the corpus must actually contain: Rideau Roofing · Apr 12, Capital Membrane · Apr 18, Unit 504 · Apr 3, Cardinal Eng. · Apr 7, Unit 210 · Apr 9, Accounts ledger · Apr 30. These become fixture requirements.

## 5 · Stack recommendation

**Default stands: TypeScript, React + Vite front end, thin Node pipeline layer, LLM behind one adapter** (Build Spec §4). Nothing observed argues otherwise; the hero was rendered from an HTML page in Chrome, which is compatible with (and trivially portable to) the default stack. Rating: `[assumption]` until the code tree is inspected; if the AI Studio code turns out to be salvageable React, WP-1.1 may lift components from it, otherwise treat Hero v1.1 as the spec and rebuild clean.

## 6 · To finish M0 (input needed from Tets)

Provide the "concierge googleaistudio app code" folder itself in a readable form: a zip/tar upload, or commit it to a branch, or any file drop into the session. On receipt, the pass completes with: full tree listing → per-file keep / rewrite / discard verdicts → hallucination check of any embedded copy or data against canon → final stack recommendation → Tets disposes.

---

*Disposition: pending Tets. Amendments require Tets's ratification.*
