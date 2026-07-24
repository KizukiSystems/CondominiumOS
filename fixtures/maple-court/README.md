# fixtures/maple-court/ — the fictional demo corpus (Lane A)

Everything in this directory is FICTIONAL and committed. No real names, companies, buildings, or Corporation 94 details, ever (CLAUDE.md rule 6; a test scans this directory to enforce part of it). All email addresses use reserved `.example` domains.

- `corpus.json` — 47 fictional messages across 17 threads, February 1 to April 30, 2026, generated fresh on 2026-07-23 (supersedes the POC-derived 8-email seed). Five decision storylines build over the three months, buried in realistic routine noise (~45%): landscaping, lost fobs, elevator notices, party-room bookings, ice complaints. Written messy on purpose: typos, ALL-CAPS subjects, run-ons, terse vendor replies. Valid both as the demo UI's data source and as `npm run ingest` input.

**Anchor messages** (cited by the demo agenda; their facts are load-bearing and must not drift):

| Anchor | Message | Fact |
| :--- | :--- | :--- |
| `membrane-05` | Rideau Roofing, Apr 12 | $42,000 recoat quote, no structural concerns |
| `membrane-06` | Capital Membrane, Apr 18 | $51,000 quote, possible slab deterioration, recommends engineer |
| `noise511-06` | Unit 504, Apr 3 | Fourth complaint since February, suspects short-term rental |
| `reserve-02` | Cardinal Engineering, Apr 7 | Study three years old, update due, $6,800 renewal offer |
| `arrears-04` | Accounts ledger, Apr 30 | Units 312 + 808, 60+ days, $9,240, two missed notices |

Still to come for WP-1.2 completion: governing documents (declaration excerpts, Act references) so legal context (the 30-day rental rule, response deadlines) can be cited instead of asserted.
