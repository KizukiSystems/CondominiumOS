/**
 * merge-corpus.ts - one-off conversion of the Notion mock database
 * ("CondominiumOSMockDatabase01" / "Fictional Property-Management Email (Demo)",
 * 93 messages, 33 threads) into fixtures/maple-court/corpus.json, merged with
 * the 47-message generated corpus (corpus v1).
 *
 * Input: a JSONL export of the Notion database (one row per line, fields:
 * tid, num, from, to, cc, date [ISO], direction, role, tag, decision,
 * subject, body). The export lives in the session scratchpad and is NOT
 * committed; the Notion database remains the source of truth for these rows
 * (WORKPLAN WP-1.2 amendment). Re-pull the export to re-run.
 *
 * Stages (flags compose):
 *   --write             convert + append after corpus v1 (mechanical only)
 *   --editorial         apply the EDITS table below (persona renames,
 *                       re-datings, storyline reconciliation; every edit is
 *                       enumerated in EDITS / GLOBAL_BODY_EDITS)
 *   --sort              re-sort the merged array newest -> oldest
 *   --labels            write fixtures/maple-court/labels.json
 *   --check             run integrity checks on the current files
 *
 * Conversion rules (mechanical):
 *   id:       lowercase "<Thread ID>-<Message #>" (t-1001-1)
 *   threadId: lowercase Thread ID (t-1001)
 *   sender:   email -> display name via SENDER_DISPLAY (fails on unmapped)
 *   to:       To + CC folded into one comma-joined string
 *   date:     "May 6" style from the ISO date (UTC); ISO retained as sort key
 *   text:     em/en dashes -> "-", smart quotes -> straight (corpus v1 style)
 *   dropped:  Direction, From role (derivable); Topic tag and Needs board
 *             decision go to labels.json only (WP-1.3 amendment: labels ride
 *             in a sidecar, the Thread shape is unchanged)
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const FIXTURE_DIR = path.join(import.meta.dirname, '..', 'fixtures', 'maple-court');
const CORPUS_PATH = path.join(FIXTURE_DIR, 'corpus.json');
const LABELS_PATH = path.join(FIXTURE_DIR, 'labels.json');
const B_ID_RE = /^t-10\d\d-\d+$/;

// sha256 of JSON.stringify of the 47 corpus v1 entries at merge time; the
// checks fail if any v1 entry (including the six cited anchors) changes.
const CORPUS_V1_SHA256 = '8bb2b40f51f0ea1e092f5588fb84489de6100b06112a13dfa0516b9b886b786f';

interface Thread {
  id: string;
  threadId?: string;
  sender: string;
  to?: string;
  date: string;
  subject: string;
  body: string;
}

interface ExportRow {
  tid: string;
  num: number;
  from: string;
  to: string;
  cc: string | null;
  date: string;
  direction: string;
  role: string;
  tag: string;
  decision: boolean;
  subject: string;
  body: string;
}

const SENDER_DISPLAY: Record<string, string> = {
  'manager@maplecourt.example': 'Dana Whitfield (Manager)',
  'concierge@maplecourt.example': 'Front Desk (Concierge)',
  'accounts@maplecourt.example': 'Accounts ledger',
  'boardchair@maplecourt.example': 'Priya Raman (Board President)',
  'treasurer@maplecourt.example': 'Board Treasurer',
  'owner504@maplecourt.example': 'Helen Moss (Unit 504)',
  'owner210@maplecourt.example': 'Sam Odei (Unit 210)',
  'owner119@maplecourt.example': 'J. Plourde (Unit 119)',
  'owner116@maplecourt.example': 'Unit 116 Owner',
  'owner302@maplecourt.example': 'Unit 302 Owner',
  'owner312@maplecourt.example': 'Unit 312 Owner',
  'owner402@maplecourt.example': 'Unit 402 Owner',
  'owner615@maplecourt.example': 'Unit 615 Owner',
  'owner717@maplecourt.example': 'Unit 717 Owner',
  'owner829@maplecourt.example': 'Unit 829 Owner',
  'service@rideauroofing.example': 'Rideau Roofing',
  'quotes@capitalmembrane.example': 'Capital Membrane',
  'projects@cardinalengineering.example': 'Cardinal Engineering',
  'service@skylineelevators.example': 'Skyline Elevators',
  'dispatch@greenpathlandscaping.example': 'GreenPath Landscaping',
  'scheduling@emberfiresystems.example': 'Ember Fire Systems',
  'service@northshoreplumbing.example': 'NorthShore Plumbing',
  'service@peakfitmaintenance.example': 'PeakFit Maintenance',
  'service@harborlocksmith.example': 'Harbor Locksmith',
  'service@brightwireelectric.example': 'BrightWire Electric',
  'dispatch@towerwaste.example': 'Tower Waste',
};

// ---------------------------------------------------------------------------
// EDITORIAL LAYER (--editorial). Corpus v1 is never touched; every edit below
// applies to the converted mock-database entries only, under the ratified
// rule "anchor facts win". Grouped for the PR:
//
// (a) Persona renames: the mock database's staff/vendor personas differ from
//     corpus v1's established cast; v1 is canon.
// (b) Vendor unification: one elevator contractor and one landscaper for the
//     building; Cardinal's domain unified to v1's cardinaleng.example.
// (c) Storyline reconciliation: re-datings and rewrites so the same events
//     are narrated once (details in EDITS, keyed by id).
// ---------------------------------------------------------------------------

// (a) + (b): ordered global replacements over converted sender/to/subject/body.
const GLOBAL_BODY_EDITS: Array<[string | RegExp, string]> = [
  ['Ari N.', 'Dana Whitfield'],
  [/\bAri\b/g, 'Dana'],
  ['Jordan Pike', 'Gord Belanger'],
  ['Samir V.\nCapital Membrane Co.', 'Sylvie Tran\nCapital Membrane Ltd.'],
  ['Leila Chen', 'Marc Aubin, P.Eng.'],
  ['Hi Leila', 'Hi Marc'],
  ['Noor (Unit 210)', 'Sam (Unit 210)'],
  ['Hi Noor', 'Hi Sam'],
  ['R. K., Board Chair', 'Priya Raman, Board President'],
  ['-R. K.', '-Priya'],
  [/-M\.?(?=$|\n)/g, '-Helen'],
  ['Hi M.,', 'Hi Helen,'],
  ['Skyline Elevators', 'Vertex Elevators'],
  ['-Skyline Service', '-Vertex Service'],
  ['skylineelevators.example', 'vertexelevators.example'],
  ['GreenPath Dispatch', 'GreenScape Dispatch'],
  ['greenpathlandscaping.example', 'greenscape.example'],
  ['cardinalengineering.example', 'cardinaleng.example'],
  ['오전 ', ''], // stray Korean "AM" in t-1017-2 (authoring artifact)
];

// Display-name overrides once vendor unification applies.
const SENDER_DISPLAY_EDITORIAL: Record<string, string> = {
  'service@skylineelevators.example': 'Vertex Elevators',
  'dispatch@greenpathlandscaping.example': 'GreenScape Landscaping',
};

// (c): per-id edits. `date` replaces the ISO sort/display date; each `sub`
// pair must match exactly once in the converted body or the script fails.
const EDITS: Record<string, { date?: string; sub?: Array<[string, string]> }> = {
  // membrane: v1 canon has the leak first reported Mar 9 at spot 41 (Rita
  // Fabbri) and quotes solicited Mar 26; the concierge triage becomes
  // same-leak follow-up and the Apr 8 solicitations become status nudges.
  't-1001-1': {
    date: '2026-03-09 15:12:00Z',
    sub: [
      [
        'We had water dripping in P1 near stall 17 again this morning (same area as last week).',
        'We had water dripping in P1 near spot 41 this morning (the resident in Unit 306 has reported it too).',
      ],
    ],
  },
  't-1001-2': { date: '2026-03-09 15:36:00Z' },
  't-1001-3': { date: '2026-03-10 14:02:00Z' },
  't-1001-4': {
    sub: [
      [
        "We manage Maple Court Condominiums (mid-rise). We have recurring water ingress in P1 parking (approx. near column P1-C4). We'd like a site visit and a quote for inspection + recommended repairs to the garage deck membrane.",
        'Following up on our March 26 request: we still have recurring water ingress in P1 parking (near column P1-C4, by spot 41). Checking where your site visit and inspection quote stand.',
      ],
    ],
  },
  't-1001-5': {
    sub: [
      [
        "We're seeing recurring leakage in the P1 garage (suspected deck membrane failure). Can you provide an inspection quote and a rough budget for remediation options?",
        'Following up on our March 26 request re: the recurring leakage in the P1 garage (suspected deck membrane failure). Checking where your inspection quote stands.',
      ],
    ],
  },
  // Same-day companions to the two v1 anchor quotes (membrane-05 / -06):
  // scope harmonized to v1's full-P1-level recoat; figures already agree.
  't-1001-6': {
    sub: [
      [
        'Thank you for meeting us on site.\n\nSummary:',
        'Thank you for meeting us on site. Summary ahead of the formal quote (sent separately this morning):\n\nFindings:',
      ],
      [
        'recoat traffic membrane in affected area and reseal joints',
        'recoat traffic membrane across the full P1 level and reseal joints',
      ],
    ],
  },
  't-1001-7': {
    sub: [
      [
        'Thanks for the site access.',
        'Thanks for the site access; further to our inspection report sent earlier today.',
      ],
    ],
  },
  // Board chair's directive softened to a leaning so the P1 membrane remains
  // an open decision for the May meeting (the demo agenda presents it open).
  't-1024-1': {
    sub: [
      [
        'Given the discrepancy between the two contractors, please obtain a structural engineer opinion first.\n\nWe need a clear statement on substrate condition before spending on a coating that could fail.\n\nProceed to get 1-2 engineer proposals.',
        "Given the discrepancy between the two contractors, my view is we likely need a structural engineer's opinion on substrate condition before spending on a coating that could fail.\n\nLet's put this on the May agenda for a proper decision rather than settle it by email. No harm lining up 1-2 engineer names for reference in the meantime.",
      ],
    ],
  },
  // noise: v1 canon counts four complaints (Feb 5-6, Feb 27-28, Mar 14-15,
  // Apr 2-3; noise511-04/-06). The mock-database complaints are re-slotted as
  // same-incident companions so the count holds.
  't-1002-1': {
    date: '2026-03-15 06:06:00Z',
    sub: [
      [
        "This is the third time I'm emailing. Unit 511 is loud late at night (2am-ish).",
        "It's 2am and Unit 511 is loud again right now.",
      ],
    ],
  },
  't-1002-2': { date: '2026-03-15 14:18:00Z' },
  't-1002-3': {
    date: '2026-02-28 16:00:00Z',
    sub: [
      [
        'It happened again last night (Feb 19, around 1:40am). Same thing: multiple people, laughing/yelling, door slamming.',
        'Adding to my email from this morning: the noise on Feb 27 went to around 1:40am. Multiple people, laughing/yelling, door slamming.',
      ],
    ],
  },
  't-1002-4': { date: '2026-02-28 18:30:00Z' },
  't-1002-5': {
    sub: [['(Apr 2 / 3am-ish)', '(Apr 2, well past 2am)']],
  },
  't-1002-6': {
    sub: [['(Feb 3, Feb 19, Apr 2/3)', '(Feb 5-6, Feb 27-28, Mar 14-15, Apr 2-3)']],
  },
  // reserve: v1's reserve-02 (same day) is the renewal letter; this becomes
  // its scheduling follow-up. The board ask points at the May agenda
  // (reserve-01/-03; the demo agenda presents the renewal as open).
  't-1003-1': {
    sub: [
      [
        "Friendly reminder that Maple Court's reserve fund study update is due this fiscal year.\n\nWe can offer renewal services (field review + updated funding plan) for $6,800 + HST. Typical turnaround",
        'Further to our renewal letter sent this morning: the offer covers the field review + updated funding plan at $6,800 + HST as quoted. Typical turnaround',
      ],
    ],
  },
  't-1003-3': {
    sub: [
      [
        'Please confirm approval to proceed so we can lock a site date.',
        'Flagging for the May agenda; once approved we can lock a site date.',
      ],
    ],
  },
  // EV: v1 canon has Sam's inquiry Mar 5 (first ever, ev210-01/-02) and
  // stall P2-14 (ev210-03).
  't-1004-1': {
    sub: [
      [
        "I'm considering an EV and wanted to ask if anyone has installed a charger in their parking spot. I'm in P2-41.",
        "Following up on my note from earlier this month - still weighing the EV purchase. Has anyone installed a charger in their spot? I'm in P2-14.",
      ],
    ],
  },
  't-1004-2': {
    sub: [
      [
        "We've had informal inquiries but no completed installations in Maple Court yet.",
        'As mentioned, yours is the first request of this kind here - no completed installations in Maple Court yet.',
      ],
    ],
  },
  't-1004-3': { sub: [['stall P2-41', 'stall P2-14']] },
  // arrears: v1 anchor (arrears-04) states notices went Mar 15 and Apr 14;
  // the mock-database notices are re-dated to match, wording aligned with
  // arrears-02 (both Feb and Mar outstanding at first notice), and the
  // Unit 808 ledger line made arithmetically consistent with its notices.
  't-1005-1': {
    date: '2026-03-15 14:05:00Z',
    sub: [
      [
        'your common expense payment for February has not been received',
        'your common expense payments for February and March have not been received',
      ],
    ],
  },
  't-1005-2': {
    date: '2026-04-14 15:41:00Z',
    sub: [['our notice dated Feb 11', 'our notice dated Mar 15']],
  },
  't-1006-1': {
    date: '2026-03-15 14:22:00Z',
    sub: [
      [
        'your February common expense payment has not been received',
        'your February and March common expense payments have not been received',
      ],
    ],
  },
  't-1006-2': {
    date: '2026-04-14 16:18:00Z',
    sub: [['our Feb 14 notice', 'our Mar 15 notice']],
  },
  't-1007-1': {
    sub: [
      [
        'As requested, arrears summary as of Apr 30:',
        'Per-unit breakdown, further to the month-end summary:',
      ],
      [
        'Unit 808: $4,200.00 outstanding (Feb + Mar unpaid; no payment since)',
        'Unit 808: $4,200.00 outstanding (Feb + Mar unpaid; one partial payment of $1,320 after the second notice)',
      ],
    ],
  },
};

// ---------------------------------------------------------------------------

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function displayDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) throw new Error(`bad ISO date: ${iso}`);
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}`;
}

function normalizeText(s: string): string {
  return s.replace(/[—–]/g, '-').replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
}

function applyGlobalEdits(s: string): string {
  for (const [find, repl] of GLOBAL_BODY_EDITS) {
    s = typeof find === 'string' ? s.split(find).join(repl) : s.replace(find, repl);
  }
  return s;
}

function loadExport(p: string): ExportRow[] {
  const rows = fs
    .readFileSync(p, 'utf8')
    .trim()
    .split('\n')
    .map((l) => JSON.parse(l) as ExportRow);
  if (rows.length !== 93) throw new Error(`expected 93 export rows, got ${rows.length}`);
  return rows;
}

function convert(rows: ExportRow[], editorial: boolean): { entries: Thread[]; iso: Map<string, string> } {
  const entries: Thread[] = [];
  const iso = new Map<string, string>();
  for (const r of rows) {
    const id = `${r.tid.toLowerCase()}-${r.num}`;
    let display = SENDER_DISPLAY[r.from];
    if (!display) throw new Error(`unmapped sender: ${r.from}`);
    if (editorial && SENDER_DISPLAY_EDITORIAL[r.from]) display = SENDER_DISPLAY_EDITORIAL[r.from];
    let to = r.cc ? `${r.to}, ${r.cc}` : r.to;
    let subject = normalizeText(r.subject);
    let body = normalizeText(r.body);
    let isoDate = r.date;
    if (editorial) {
      to = applyGlobalEdits(to);
      subject = applyGlobalEdits(subject);
      body = applyGlobalEdits(body);
      const e = EDITS[id];
      if (e) {
        if (e.date) isoDate = e.date;
        for (const [find, repl] of e.sub ?? []) {
          const parts = body.split(find);
          if (parts.length !== 2) {
            throw new Error(
              `edit for ${id} matched ${parts.length - 1} times (want 1): ${find.slice(0, 60)}`,
            );
          }
          body = parts.join(repl);
        }
      }
    }
    iso.set(id, isoDate);
    entries.push({
      id,
      threadId: r.tid.toLowerCase(),
      sender: display,
      to,
      date: displayDate(isoDate),
      subject,
      body,
    });
  }
  return { entries, iso };
}

function readCorpus(): Thread[] {
  return JSON.parse(fs.readFileSync(CORPUS_PATH, 'utf8')) as Thread[];
}

function corpusV1(all: Thread[]): Thread[] {
  return all.filter((t) => !B_ID_RE.test(t.id));
}

function v1Sha(all: Thread[]): string {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(corpusV1(all)))
    .digest('hex');
}

function writeCorpus(entries: Thread[]) {
  fs.writeFileSync(CORPUS_PATH, JSON.stringify(entries, null, 2) + '\n');
}

// day-precision value for sorting; v1 dates have no year (all 2026).
function dayValue(t: Thread, iso: Map<string, string>): number {
  const src = iso.get(t.id);
  if (src) return Date.parse(src.replace(' ', 'T'));
  const m = t.date.match(/^([A-Z][a-z]{2}) (\d{1,2})$/);
  if (!m) throw new Error(`unparseable v1 date on ${t.id}: ${t.date}`);
  // v1 entries sort by day only; Date.UTC at noon keeps them stable between
  // same-day mock-database timestamps without inventing a time of day.
  return Date.UTC(2026, MONTHS.indexOf(m[1]), Number(m[2]), 12, 0, 0);
}

function checks(all: Thread[], rows: ExportRow[]) {
  const errs: string[] = [];
  const v1 = corpusV1(all);
  const b = all.filter((t) => B_ID_RE.test(t.id));
  if (v1.length !== 47) errs.push(`corpus v1 entries: ${v1.length}, expected 47`);
  if (b.length !== 93) errs.push(`mock-database entries: ${b.length}, expected 93`);
  if (v1Sha(all) !== CORPUS_V1_SHA256)
    errs.push(
      'corpus v1 entries changed (sha mismatch): the 47 v1 messages, including the six cited anchors, must be byte-identical',
    );
  const ids = new Set(all.map((t) => t.id));
  if (ids.size !== all.length) errs.push('duplicate ids');
  const threads = new Set(all.map((t) => t.threadId ?? t.id));
  if (threads.size !== 50) errs.push(`thread count ${threads.size}, expected 50`);
  for (const anchor of [
    'membrane-05',
    'membrane-06',
    'noise511-06',
    'reserve-02',
    'ev210-03',
    'arrears-04',
  ]) {
    if (!ids.has(anchor)) errs.push(`missing anchor ${anchor}`);
  }
  for (const t of all) {
    for (const m of `${t.to ?? ''} ${t.body}`.matchAll(/[\w.+-]+@([\w.-]+)/g)) {
      if (!m[1].endsWith('.example')) errs.push(`${t.id}: non-.example address ${m[0]}`);
    }
    if (/\bCMG\b/i.test(`${t.sender} ${t.subject} ${t.body}`)) errs.push(`${t.id}: CMG marker`);
  }
  for (const t of b) {
    if (/[—–‘’“”]/.test(`${t.subject} ${t.body}`)) errs.push(`${t.id}: unnormalized dash/quote`);
  }
  // labels
  if (fs.existsSync(LABELS_PATH)) {
    const labels = JSON.parse(fs.readFileSync(LABELS_PATH, 'utf8'));
    const keys = Object.keys(labels.labels);
    if (keys.length !== 93) errs.push(`labels: ${keys.length} keys, expected 93`);
    for (const k of keys) if (!ids.has(k)) errs.push(`labels: ${k} not in corpus`);
    const yes = keys.filter((k) => labels.labels[k].needsBoardDecision).length;
    if (yes !== 28) errs.push(`labels: ${yes} needsBoardDecision, expected 28`);
    const tags = new Set(keys.map((k) => labels.labels[k].topicTag));
    if (tags.size !== 13) errs.push(`labels: ${tags.size} topic tags, expected 13`);
  }
  // export linkage
  for (const r of rows) {
    if (!ids.has(`${r.tid.toLowerCase()}-${r.num}`))
      errs.push(`export row ${r.tid}-${r.num} missing from corpus`);
  }
  if (errs.length) {
    console.error('CHECKS FAILED:\n' + errs.join('\n'));
    process.exit(1);
  }
  console.log(
    `checks pass: ${all.length} messages, ${threads.size} threads, v1 intact, domains/CMG/normalization clean`,
  );
}

// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const exportPath = args.find((a) => !a.startsWith('--'));
if (!exportPath) {
  console.error(
    'usage: tsx scripts/merge-corpus.ts <notion-export.jsonl> [--write] [--editorial] [--sort] [--labels] [--check]',
  );
  process.exit(1);
}
const rows = loadExport(exportPath);
const editorial = args.includes('--editorial');
const { entries: bEntries, iso } = convert(rows, editorial);

if (args.includes('--write')) {
  const v1 = corpusV1(readCorpus());
  let merged = [...v1, ...bEntries];
  if (args.includes('--sort')) {
    merged = merged
      .map((t, i) => ({ t, i }))
      .sort((a, b) => dayValue(b.t, iso) - dayValue(a.t, iso) || a.i - b.i)
      .map((x) => x.t);
  }
  writeCorpus(merged);
  console.log(
    `wrote ${merged.length} messages (${v1.length} v1 + ${bEntries.length} converted${editorial ? ', editorial' : ''}${args.includes('--sort') ? ', sorted' : ''})`,
  );
}

if (args.includes('--labels')) {
  const labels: Record<string, { topicTag: string; needsBoardDecision: boolean }> = {};
  for (const r of rows) {
    labels[`${r.tid.toLowerCase()}-${r.num}`] = { topicTag: r.tag, needsBoardDecision: r.decision };
  }
  fs.writeFileSync(
    LABELS_PATH,
    JSON.stringify(
      {
        corpus: 'corpus.json',
        provenance:
          'Ground-truth labels (Topic tag, Needs board decision) from the Notion mock database, keyed by doc id. WP-1.3 eval scope is exactly the keys present here; corpus v1 docs are unlabeled by design.',
        labels,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(`wrote ${Object.keys(labels).length} labels`);
}

if (args.includes('--check')) {
  checks(readCorpus(), rows);
}
