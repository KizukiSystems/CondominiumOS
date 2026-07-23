# Sources — provenance for the roadmap and work plan

The roadmap, work plan, and operating rules in this repo derive from the documents below (provided 2026-07-23). Descriptions only; the documents themselves live in Tets's Drive/Claude project, not in this repo. **Corporation 94 material is confidential real client data and never enters this repo.**

| Document | Role in this plan |
| :--- | :--- |
| **Concierge — Claude Code Build Spec v0.1** | Primary source: lanes, milestones M0-M3, repo/stack, data model, §6 data-handling contract, CLAUDE.md seed, success definition |
| **Concierge — Project Map** | Phase model (-1 → 0 → 1 → 2+) and the confidence-gate discipline between phases |
| **Concierge — Cross-AI Context Map v0.2** | Handling rules, epistemic tagging (`[grounded]/[assumption]/[open]`), source tiers, open unknowns, methodology borrow-notes (MET-004 Spawn-vs-Fold, MET-006 Cold-Reader, MET-008 Salvage Pass, MET-012 Two-Layer Attribution). Supersedes v0.1 |
| **Concierge — Cross-AI Context Map v0.1** | Superseded by v0.2 (one-live-file rule); listed for lineage only |
| **Concierge — Discovery & Verification Log** | The `[solid]/[confirm]/[fuzzy]` claims to verify with Isaac; thesis-first discipline |
| **Isaac Meeting Briefing — Fri 2026-07-24** | The gate meeting: win condition, wedge-confirmation questions, foundation items, traps; drives the outcome-branch table in ROADMAP.md §2 |
| **Concierge — Claude Design Build Kit** | The Maple Court hero-screen brief: five fictional agenda items, "quiet confidence" design direction, the feeling test; drives WP-1.2/WP-1.4 |
| **Concierge_Hero_v1.1** | Visual reference for the hero screen mockup |
| **Concierge — Video Digestion Handoff** | Spec for processing Isaac's footage; confidentiality as first-class constraint |
| **"My Work Recorded" digestion handoff** | The "before" state: inbox-clearing session analysis (tool stack, work taxonomy, repetitive-vs-judgment split). Real client data; details stay out of this repo |
| **"Board Meeting" digestion handoff (v1, v2)** | The "after" state: 75-min board meeting analysis validating options-not-decisions and the board-prep wedge. Real client data; details stay out of this repo |
| **CondominiumOS — Foundations-First Repo Scouting Report** (provided 2026-07-23, reviewed Shift 002) | Reference only, Phase 2+ foundations research: OSS schema/pipeline survey (condo MIT mixins, dlt/dbt, Supabase RLS, admin UIs) with a license cheat-sheet (valid now, re-verify at adoption). Its stack recommendation (Python + dlt + dbt + Postgres) assumes a platform premise and **conflicts with the Build Spec §4 default stack; not adopted**, per the no-silent-rewrites rule. Claims cited but unverified in-session `[open]`. Harvest map in the Shift 002 log entry. Tets 2026-07-23: the Python premise was research drift, no second track; report retained for its framework, meta-patterns, and plumbing reference value |
| **External senior-dev code review** (Perplexity via repo access, 2026-07-23, provided in chat) | Audit of the pre-build modules: verdict sound ("a repo I'd be happy to inherit"), with tracked findings. Drove the quality batch (CI, ESLint/Prettier, docs/REVIEW.md, README refresh) executed same day; deferred findings tracked in ROADMAP §3a quality follow-ups. Caveats on file: its "Top risks" section arrived empty/truncated, and it does not substitute for the human review (docs/REVIEW.md) |

Recommended cold-start read order (per the Context Map): lineage log → watch guide → board-meeting analysis → code only if building. Within this repo: README → ROADMAP → WORKPLAN → CLAUDE.md.
