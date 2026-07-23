# SALVAGE.md — M0 Salvage Pass (MET-008)

**Status:** v1.0 RATIFIED · run 2026-07-23 by Claude Code · disposed by Tets 2026-07-23: verdicts accepted as written; §4 repair rules confirmed binding for any port. **M0 closed.**
**Source assessed:** `KizukiSystems/Concierge-OG` @ `65a6017` ("feat: bootstrap project with React and Gemini API", sole commit), synced by Tets from Google AI Studio. Supersedes v0.1 (which ran on uploads only; v0.1 text preserved in git history at `30407a5`).

## 1 · What was assessed `[grounded]`

- Full tree: 23 files, ~1,650 lines of TS/TSX. Every file read in full this session.
- Toolchain verified: `tsc --noEmit` passes clean; production build (`vite build` + esbuild server bundle) succeeds.
- Stack observed: TypeScript, React 19, Vite 6, Tailwind 4, thin Express/Node server, Gemini via `@google/genai` (model `gemini-3.1-pro-preview`), `motion` for animation, `lucide-react` icons.

## 2 · Summary verdict

**Good bones.** The POC is a working, typechecking vertical slice of the M1 demo: inbox → generate → agenda with citation chips → source panel. Verdicts by layer:

- **KEEP:** the UI layer (Agenda, CitationPanel, Inbox, DocumentsList, Layout), the domain types, the fixture seed, the design theme (Inter + Playfair Display, quiet-confidence palette).
- **REWRITE:** the pipeline layer (server.ts + gemini.ts); it works but violates three invariants (no adapter, LLM-invented Manager's Suggestion, no citation-coverage enforcement).
- **DISCARD:** AI Studio harness artifacts, the CMG-branded reporting surface, the simulated publish/autonomy theater, the DB-schema dev toy.

## 3 · Per-file verdicts

| File | Verdict | Basis |
| :--- | :--- | :--- |
| `src/types.ts` | **KEEP, amend** | Clean domain model matching the hero (AgendaItem, Citation, Option, Thread). Amend for the citation invariant: citations exist only at item level; options and talkingPoints carry none, and there is no `[uncited]` representation |
| `src/data/mockEmails.ts` | **KEEP as WP-1.2 seed** | All six canon-required sources present with exact dates and amounts (Rideau Apr 12 $42k, Capital Apr 18 $51k, Unit 504 Apr 3, Cardinal Apr 7 $6,800, Unit 210 Apr 9, ledger Apr 30 $9,240) plus two routine distractors that exercise the ignore-routine filter. Expand from 8 single messages to the ~15-25 doc corpus. `cachedAgendaItems` fallback: keep the mechanism (it is the deterministic-demo seed), fix the talking points (see §4) |
| `src/components/Agenda.tsx` | **KEEP core, cut theater** | The agenda render (decision headlines, amber engineer chip, citation chips, option cards with Manager's Suggestion) matches Hero v1.1 closely. Cut: the fake publish flow and "published" banner (see §4 item 4); hard-coded "31 messages across 8 threads" |
| `src/components/CitationPanel.tsx` | **KEEP** | Exactly the citation-chip → source-email panel the spec wants. Remove the dead "Open in portal" button |
| `src/components/Inbox.tsx` | **KEEP** | Simple, correct. "Prep Board Meeting" entry point |
| `src/components/DocumentsList.tsx` | **KEEP** | Simple document stack list |
| `src/components/Layout.tsx` | **KEEP, trim** | Sidebar shell. Remove/rename the CMG Reports nav item (§4 item 1); Calendar is a dead link |
| `src/components/ActionLog.tsx` | **DEFER (out of M1 scope)** | Post-meeting action checklist. Concept is fine ("Pending Board Approval" framing respects humans-decide) but "Execute:" labels skirt the autonomy line and M1 does not include it |
| `src/components/CMGReports.tsx` | **DISCARD** | Real company name in fictional demo (§4 item 1) plus fabricated metrics ("PM Time Saved ~4 hrs") and uncited executive-summary prose. Out of M1 scope in any form |
| `src/components/DatabaseView.tsx` | **DISCARD from product** | Draggable ER-diagram dev toy. Not in spec. Note: its schema sketch (UUID PKs, Citations as a first-class table FK'd to AgendaItems and Threads) is a reasonable data-model outline; keep the idea, not the component |
| `server.ts` | **REWRITE** | Working thin-Node endpoint proves the shape, but: Gemini called directly (WP-1.1 requires all LLM access behind `src/llm/adapter.ts`); the prompt orders the LLM to invent the Manager's Suggestion and talking points (§4 items 2-3); no citation-coverage check or `[uncited]` fallback; silent `[]` on parse failure; no determinism (no cache/seed) |
| `src/lib/gemini.ts` | **KEEP shape** | Client-side fetch to the server endpoint; right pattern. Rename away from "gemini" once the adapter exists |
| `src/index.css` | **KEEP** | Inter + Playfair Display theme; matches the hero's serif/sans quiet-confidence direction |
| `package.json` | **REWRITE** | Scaffold seed only: named "react-example", `vite` listed in both dependencies and devDependencies, AI Studio scripts. Dependency choices themselves are sound |
| `vite.config.ts`, `tsconfig.json`, `index.html` | **KEEP, clean** | Standard; strip AI Studio HMR comments, retitle index.html |
| `metadata.json`, `.env.example` (APP_URL), `assets/.aistudio/` | **DISCARD** | AI Studio harness artifacts, meaningless outside that runtime |
| `.gitignore` | **KEEP** | Already ignores `.env*` correctly (keeps `.env.example`) |

## 4 · Hallucination and canon check

Fixture **content** is faithful to canon `[grounded]`: all six required sources exact, meeting metadata matches the hero (OCSCC 742 · 88 units · Thursday May 8 2026 · Party Room, 200 Maple Court Lane), and the five agenda items reproduce the Design Kit set. The violations are structural:

1. **Real/fictional mixing: CMG.** The real management company's name appears in fictional demo code: `CMGReports.tsx`, the Layout nav, a mock stakeholder email `awilliams@cmg.com` (App.tsx), and the publish step "Compiling summary for CMG reporting...". Violates CLAUDE.md rule 6. Any port renames to a fictional management company.
2. **Fabricated, uncited talking points.** `cachedAgendaItems` talking points invent claims with no source: "$500k if the slab fails", "Market rates have gone up ~15%", "tight window to register liens". One is an outright cross-item hallucination: "Strongly advise bringing in **Cardinal Engineering**" for the structural slab review; Cardinal is the reserve-fund-study firm, and no structural firm is named in any source. This is exactly the failure mode the citation invariant exists to catch.
3. **LLM-invented Manager's Suggestion.** The server prompt commands "EXACTLY ONE option per item has isManagerSuggestion: true", so the model picks the recommendation. Canon: the Manager's Suggestion derives from the manager's own stated position; the tool never originates advice. The talking-points field has the same defect ("Strongly advise..."). Rewrite so the suggestion comes from manager input or is confirmed by the manager, never model-assigned.
4. **Simulated autonomous actions.** The publish flow animates "Creating the next board meeting event... Inviting appropriate stakeholders... Pushing data to condo board documentation..." and the success banner claims calendar events and portal syncs happened. All fake, but it demos the wrong promise; the invariant is no autonomous sending/filing, L0-L1 only. Replace with an honest export ("pack rendered to file, nothing sent").
5. **Citation coverage is item-level only.** The data-model invariant requires no AgendaItem, background sentence, or Option without a citation, with `[uncited — needs source]` as the fallback. The POC cites at item level, options and talking points carry nothing, and nothing enforces coverage. WP-1.3's citation-coverage test remains to be built.
6. **"31 messages across 8 threads" confirmed hard-coded** (Agenda.tsx). The corpus is 8 threads of one message each. Resolves the v0.1 discrepancy: make the banner computed from the corpus.

## 5 · Final stack recommendation `[grounded — upgraded from v0.1's assumption]`

**Default stack CONFIRMED by inspection.** The POC already is Build Spec §4's stack: TypeScript, React + Vite front end, thin Node pipeline layer. No rewrite of stack, only of structure:

- Move LLM access behind `src/llm/adapter.ts` (Gemini default, Anthropic drop-in) per WP-1.1.
- Keep the POC's cached-fallback mechanism as the seed of deterministic demo regeneration.
- Add the citation-coverage test (WP-1.3) as a hard gate, not a style.
- React 19 / Vite 6 / Tailwind 4 versions are current and fine to carry forward.

## 6 · What WP-1.1/1.2 can lift directly

`types.ts` (amended), `index.css` theme, `CitationPanel.tsx`, `Inbox.tsx`, `DocumentsList.tsx`, `Layout.tsx` (trimmed), `Agenda.tsx` (theater cut), `mockEmails.ts` threads as the first 8 corpus entries, the client-fetch pattern from `gemini.ts`, and the server-endpoint shape from `server.ts` rebuilt behind the adapter. Estimated: roughly 60% of the POC survives into M1, mostly the UI layer.

## 7 · Open questions folded into this pass

- `Concierge-OG` is reference-only; the build home question (ledger #10, `CondominiumOS` vs `concierge`) is unchanged and still Tets's call.
- The POC pins `gemini-3.1-pro-preview`; adapter work should treat model choice as config, not code.

---

*Disposition: ratified by Tets 2026-07-23 (verdicts accepted; repair rules confirmed; build home = `CondominiumOS`, ledger #10). Amendments require Tets's ratification.*
