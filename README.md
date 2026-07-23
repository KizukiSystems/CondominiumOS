# CondominiumOS — Concierge planning and canon repo

**Concierge** is a local-first copilot that turns a month of condo correspondence and meeting material into a **board-prep pack**: per agenda item, a one-line decision summary, background with citations to source, and 2-3 options with one marked "Manager's suggestion." It generates options; humans decide.

Built under **Kizuki Systems Inc.** (Ottawa). Owner: Tetsuro Ide. Builder: Claude Code.

## What this repo is

The planning and canon home for the Concierge project: roadmap, work plan, and operating rules. The Build Spec names `KizukiSystems/concierge` as the future code repo; whether the build lands there or here is an `[open]` decision for Tets (see the Open Items ledger in ROADMAP.md).

## Start here

| File | What it is |
| :--- | :--- |
| [ROADMAP.md](ROADMAP.md) | The phased roadmap: phase model, the gate, milestones M0-M3, invariants, open items |
| [WORKPLAN.md](WORKPLAN.md) | Work packages sized for one Claude Code session/PR each, with definitions of done |
| [CLAUDE.md](CLAUDE.md) | Operating rules for Claude Code sessions in this repo |
| [SHIFTLOG.md](SHIFTLOG.md) | Per-session shift log; read the newest entry at shift start (MET-009 reconciliation) |
| [docs/SOURCES.md](docs/SOURCES.md) | Provenance: the source documents this plan derives from |

## Confidentiality (read before contributing)

- This project involves **real client data** in its pilot phase: a real condominium corporation ("Corporation 94"), real people, real businesses. **Real client data never enters this repo.** Ever.
- **"Maple Court" / OCSCC 742 is FICTIONAL** demo data. Corporation 94 is real. The two are never mixed in code, fixtures, or copy.
- Work is split into two lanes: **Lane A** (fictional data, open now) and **Lane B** (real data, closed until the data-handling contract is ratified). If a task is ambiguous about its lane, it is Lane B: stop and flag. Details in CLAUDE.md and ROADMAP.md.
