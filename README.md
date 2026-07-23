# CondominiumOS — Concierge: canon and build repo

**Concierge** is a local-first copilot that turns a month of condo correspondence and meeting material into a **board-prep pack**: per agenda item, a one-line decision summary, background with citations to source, and 2-3 options with one marked "Manager's suggestion." It generates options; humans decide.

Built under **Kizuki Systems Inc.** (Ottawa). Owner: Tetsuro Ide. Builder: Claude Code.

## Status (2026-07-23)

M0 (salvage pass on the old POC) is complete and ratified. The gate-invariant pre-build is done: scaffold, LLM adapter, citation engine, universal ingest, and the demo UI, all tested. The wedge-specific pipeline (corpus expansion, classify/generate) is deliberately unbuilt pending the stakeholder gate meeting; see ROADMAP §2-§3a.

## Quickstart

```
npm install
npm run demo      # dev server: inbox -> prep -> cited agenda -> source panel
npm test          # 24 tests, including the citation-coverage gate
npm run ingest -- fixtures/maple-court   # file-drop ingest CLI
```

The demo runs on fictional cached data with no model calls. Live generation needs keys (`cp .env.example .env`) and arrives with WP-1.3.

## Repo map

| Path | What it is |
| :--- | :--- |
| [ROADMAP.md](ROADMAP.md) | Phase model, the gate, milestones M0-M3, invariants, open-items ledger, pre-build queue (§3a) |
| [WORKPLAN.md](WORKPLAN.md) | Work packages with definitions of done |
| [CLAUDE.md](CLAUDE.md) | Operating rules for Claude Code sessions |
| [SHIFTLOG.md](SHIFTLOG.md) | Per-session shift log; read the newest entry at shift start |
| [SALVAGE.md](SALVAGE.md) | M0 verdicts on the old POC (ratified) |
| [docs/SOURCES.md](docs/SOURCES.md) | Provenance: the documents and reviews this project derives from |
| [docs/REVIEW.md](docs/REVIEW.md) | Human review guide for the five pre-build modules |
| `src/citations/` | The citation invariant, executable: cite or emit `[uncited — needs source]`; coverage is a build-failing test |
| `src/ingest/` | Universal manual file-drop ingest (txt/md/eml/json/pdf); metadata never inferred |
| `src/llm/` | The one door to any model: Gemini default, Anthropic drop-in, model as config |
| `src/ui/` | Demo UI ported from the POC with the ratified repair rules applied |
| `src/classify/`, `src/agenda/` | Pipeline stages, gated on the wedge confirmation (README stubs) |
| `fixtures/maple-court/` | Committed FICTIONAL corpus (OCSCC 742) |
| `data/`, `runs/` | Gitignored. Real material only, Lane B, closed until Build Spec §6 is ratified |

## Confidentiality (read before contributing)

- This project involves **real client data** in its pilot phase: a real condominium corporation ("Corporation 94"), real people, real businesses. **Real client data never enters this repo.** Ever.
- **"Maple Court" / OCSCC 742 is FICTIONAL** demo data. Corporation 94 is real. The two are never mixed in code, fixtures, or copy; a test enforces part of this.
- Work is split into two lanes: **Lane A** (fictional data, open now) and **Lane B** (real data, closed until the data-handling contract is ratified). If a task is ambiguous about its lane, it is Lane B: stop and flag. Details in CLAUDE.md and ROADMAP.md.
