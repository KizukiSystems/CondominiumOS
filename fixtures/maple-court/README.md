# fixtures/maple-court/ — the fictional demo corpus (Lane A)

Everything in this directory is FICTIONAL and committed. No real names, companies, buildings, or Corporation 94 details, ever (CLAUDE.md rule 6; a test scans this directory to enforce part of it). All email addresses use reserved `.example` domains.

- `corpus.json` — 140 fictional messages across 50 threads, February 3 to May 15, 2026, from two merged sources (see provenance below). Five decision storylines build over the months, buried in realistic routine noise: landscaping, lost fobs, elevator notices, party-room bookings, ice complaints, fire alarm inspections, a garbage chute jam, a stairwell security incident. Written messy on purpose: typos, ALL-CAPS subjects, run-ons, terse vendor replies. Valid as the demo UI's data source; `npm run ingest` on this folder re-slugs ids from file paths (see the WP-1.3 note below).
- `labels.json` — ground-truth labels (`topicTag`, `needsBoardDecision`) for the 93 mock-database docs, keyed by doc id per the WP-1.3 amendment (labels ride in a sidecar; the message shape is unchanged). Corpus v1 docs are unlabeled by design; the WP-1.3 classification eval scopes to exactly the keys present here.

## Provenance

- **Corpus v1** (2026-07-23): 47 messages / 17 threads, generated fresh (superseded the POC-derived 8-email seed). Ids like `membrane-05`; dates "Apr 12" style.
- **Corpus v2 merge** (2026-07-24, SHIFTLOG Shift 008): the 93-message / 33-thread Notion mock database ("CondominiumOSMockDatabase01", ratified as the WP-1.2 corpus in Shift 007) converted and merged in by `scripts/merge-corpus.ts`. Ids like `t-1001-1` (lowercased Notion Thread ID + message number). The Notion database remains the source of truth for these rows; the conversion is re-runnable from a fresh export. Editorial reconciliation (personas, dates, storyline weave) is enumerated in the script's `EDITS` tables; corpus v1 messages are byte-identical to v1 (sha-checked).

## Conventions

- `date` is "May 6" style with no year; every message is 2026.
- `to` may hold multiple comma-joined addresses (CC folded in).
- `sender` is a display name; the mock-database sender emails map to display names via the table in `scripts/merge-corpus.ts` (e.g. `manager@maplecourt.example` → "Dana Whitfield (Manager)").
- Cast: Dana Whitfield (manager), Priya Raman (board president), Front Desk (concierge), Helen Moss (Unit 504), Sam Odei (Unit 210), Rita Fabbri (Unit 306), J. Plourde (Unit 119). Vendors: Rideau Roofing (Gord Belanger), Capital Membrane (Sylvie Tran), Cardinal Engineering (Marc Aubin), Vertex Elevators, GreenScape Landscaping, Ember Fire Systems, NorthShore Plumbing, PeakFit Maintenance, Harbor Locksmith, BrightWire Electric, Tower Waste.

**Anchor messages** (cited by the demo agenda; their facts are load-bearing and must not drift):

| Anchor | Message | Fact |
| :--- | :--- | :--- |
| `membrane-05` | Rideau Roofing, Apr 12 | $42,000 recoat quote, no structural concerns |
| `membrane-06` | Capital Membrane, Apr 18 | $51,000 quote, possible slab deterioration, recommends engineer |
| `noise511-06` | Unit 504, Apr 3 | Fourth complaint since February, suspects short-term rental |
| `reserve-02` | Cardinal Engineering, Apr 7 | Study three years old, update due, $6,800 renewal offer |
| `ev210-03` | Unit 210, Apr 9 | Formal request, Level 2 charger at stall P2-14 |
| `arrears-04` | Accounts ledger, Apr 30 | Units 312 + 808, 60+ days, $9,240, two missed notices |

WP-1.3 note: the ingest JSON reader currently ignores explicit `id`/`threadId` fields (it slugs ids from file paths), so the label sidecar lines up only when the corpus is consumed by direct import (as the demo does) or via the planned corpus container. Flagged in SHIFTLOG Shift 008 as a WP-1.3 precondition.

Still to come for WP-1.2 completion: governing documents (declaration excerpts, Act references) so legal context (the 30-day rental rule, response deadlines) can be cited instead of asserted.
