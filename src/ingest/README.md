# src/ingest/ — universal manual ingest

Built 2026-07-23 (gate-invariant pre-build item 4, ROADMAP §3a). Reads a dropped folder of files into the source-document model everything downstream consumes. Manual file drops only in v0.x: no account access, no integrations, no OAuth (ratified by Tets 2026-07-23; Build Spec §2 invariant).

- `model.ts` — `SourceDoc`: stable slug id (the citation target), file name, format, and only what the source itself declares (sender/date/subject are never inferred or reformatted).
- `ingest.ts` — `ingestDirectory(dir)`: recursive walk, deterministic order (sorted by relative path), per-format parsers, warnings instead of silent drops.
- `ingest.test.ts` — 8 tests in the `npm test` gate.

| Format | Handling |
| :--- | :--- |
| `.txt` / `.md` | Body as-is; an email-style `From:/Date:/Subject:` header block at the top is recognized; first markdown heading becomes the subject |
| `.eml` | RFC 5322 headers (folded lines unfolded); multipart MIME kept raw with a warning (no part decoding yet) |
| `.json` | Thread export: one object or an array of `{sender?, date?, subject?, body}`; matches the POC mock-thread shape so the WP-1.2 seed ports directly |
| `.pdf` | Text extraction via `unpdf` (pure JS); zero-text PDFs (scans) warn |
| anything else | Skipped with a warning, never a crash |

CLI: `npm run ingest -- <folder>` prints what was read plus every warning; reads only, writes nothing. Lane note: the tool is lane-agnostic; pointing it at real material (`data/`, local only) is a Lane B act and stays closed until Build Spec §6 is ratified.
