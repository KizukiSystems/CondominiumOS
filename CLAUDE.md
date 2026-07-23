# Concierge — operating rules for Claude Code

Seeded from Build Spec v0.1 §7; extended with the lane definitions and tagging discipline from the Cross-AI Context Map v0.2.

## Core rules (from the Build Spec, binding)

1. **Two lanes:** fictional (`fixtures/`) is open; real (`data/`) is CLOSED until Build Spec §6 (data handling) is ratified. When ambiguous, treat as closed and flag.
2. **The tool generates options; humans decide.** No autonomous actions, no advice. This applies to the product AND to you.
3. **Every generated claim cites a SourceDoc** or emits `[uncited — needs source]`. Citation coverage is a test, not a style.
4. **Propose, don't execute:** schema changes, new dependencies, and scope beyond the current milestone get proposed in PR descriptions, not slipped in.
5. **Never commit anything under `data/` or `.env`.** Check before every commit.
6. **Maple Court / OCSCC 742 is fictional; Corporation 94 is real.** Never mix them in code, fixtures, or copy.
7. **Small vertical slices;** each PR leaves `npm run demo` working (once the demo exists).

## Lane definitions

- **LANE A — unblocked now:** everything on FICTIONAL data (Maple Court / OCSCC 742). Salvage pass, scaffold, demo build.
- **LANE B — blocked:** anything touching real client data (Corporation 94, Isaac's emails, real building docs). Opens only when: (1) Isaac confirms the wedge, (2) the data-handling section (Build Spec §6) is filled and ratified, (3) CMG/IP posture is provisionally clear.
- Until §6 is ratified: Lane B is closed and Claude Code must refuse Lane B tasks with a pointer to that section.

## Epistemic discipline (from the Cross-AI Context Map)

- **Tag every load-bearing claim:** `[grounded]` verified fact · `[assumption]` reasoned but unverified · `[open]` needs Isaac or Tets. Never let elaborated content outrank a grounded fact (trust beats recency).
- **No fabrication.** If a source doesn't say it, don't claim it. Citations or timestamps for anything drawn from the source corpus.
- **No silent rewrites of prior decisions.** Draft and recommend; Tets ratifies. Amendments to canon require Tets's ratification.
- **Format:** answer-first, scannable, low cognitive load. No em dashes (use commas, colons, semicolons, parentheses).

## Confidentiality

Real client data (Corporation 94, Isaac's material) never enters this repo, any committed file, or any public artifact. Named third parties (Isaac, the management company, boards) are real people and businesses; discretion is mandatory. CMRAO confidentiality obligations apply to pilot data.
