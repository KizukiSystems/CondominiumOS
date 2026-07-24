// Deterministic demo data over the generated Maple Court corpus
// (fixtures/maple-court/corpus.json: 47 fictional messages, Feb-Apr 2026,
// five decision storylines plus routine noise; supersedes the POC seed).
// The cached agenda items state only what the corpus's cited anchor
// messages support; the coverage test in demoSeed.test.ts enforces this.
// Legal context (the 30-day rental rule, Act deadlines) arrives when the
// corpus grows governing documents to cite.
import corpusJson from '../../../fixtures/maple-court/corpus.json';
import type { AgendaItem, Thread } from '../types';

export const seedThreads: Thread[] = corpusJson;

export const cachedAgendaItems: AgendaItem[] = [
  {
    id: 'a1',
    category: 'MAINTENANCE',
    decisionHeadline: 'Award the garage membrane repair, or assess the slab first',
    background:
      'Two contractors inspected the P1 garage membrane after the March leak. Rideau Roofing quoted $42,000 for a standard recoat with no structural concerns noted. Capital Membrane quoted $51,000 and noted staining consistent with possible slab deterioration beneath, recommending a structural engineer confirm before any recoat.',
    citations: [
      { sourceId: 'membrane-05', source: 'Rideau Roofing', date: 'Apr 12' },
      { sourceId: 'membrane-06', source: 'Capital Membrane', date: 'Apr 18' },
    ],
    needsEngineer: true,
    options: [
      {
        id: 'o1',
        title: 'Commission a structural engineer',
        detail: 'Scope the slab before awarding any recoat, per the second inspection.',
        meta: 'Cost and timeline to be quoted',
        isManagerSuggestion: true,
      },
      {
        id: 'o2',
        title: 'Award to Rideau Roofing',
        detail: 'Standard membrane recoat, no structural review.',
        meta: '$42,000',
        isManagerSuggestion: false,
      },
      {
        id: 'o3',
        title: 'Award to Capital Membrane',
        detail: 'Higher quote; raised the structural concern.',
        meta: '$51,000',
        isManagerSuggestion: false,
      },
    ],
    talkingPoints:
      'The two quotes differ by $9,000 and disagree on what matters: Rideau saw no structural concerns; Capital flagged possible slab deterioration and recommends an engineer confirm first. The real decision is whether to assess the slab before awarding either recoat.',
    status: 'pending',
  },
  {
    id: 'a2',
    category: 'COMPLIANCE',
    decisionHeadline: 'Decide how to respond to the recurring noise complaint at Unit 511',
    background:
      'The owner of Unit 504 has complained four times since February about late-night noise and constant turnover at Unit 511, and suspects it is being used as a short-term rental.',
    citations: [{ sourceId: 'noise511-06', source: 'Unit 504', date: 'Apr 3' }],
    needsEngineer: false,
    options: [
      {
        id: 'o4',
        title: 'Issue a formal warning letter',
        detail: 'Document the complaints and put the owner of 511 on notice.',
        meta: 'Standard first step',
        isManagerSuggestion: true,
      },
      {
        id: 'o5',
        title: 'Request a compliance check',
        detail: 'Have management verify occupancy on-site.',
        meta: '',
        isManagerSuggestion: false,
      },
      {
        id: 'o6',
        title: 'Refer to legal counsel',
        detail: 'Begin the enforcement process now.',
        meta: 'Higher cost',
        isManagerSuggestion: false,
      },
    ],
    talkingPoints:
      'Four complaints from the same owner since February, alleging turnover consistent with short-term rental. Nothing is formally documented yet; a warning letter starts the paper trail before any escalation.',
    status: 'pending',
  },
  {
    id: 'a3',
    category: 'RESERVE FUND',
    decisionHeadline: "Commission this fiscal year's reserve fund study update",
    background:
      'Cardinal Engineering advises the reserve fund study is three years old and an update is due this fiscal year. They have offered to renew at last cycle’s rate of $6,800.',
    citations: [{ sourceId: 'reserve-02', source: 'Cardinal Eng.', date: 'Apr 7' }],
    needsEngineer: false,
    options: [
      {
        id: 'o7',
        title: 'Renew with Cardinal',
        detail: 'Continuity with the prior study; rate held at last cycle’s.',
        meta: '$6,800',
        isManagerSuggestion: true,
      },
      {
        id: 'o8',
        title: 'Solicit competing quotes',
        detail: 'Compare the market before committing.',
        meta: 'Adds lead time',
        isManagerSuggestion: false,
      },
    ],
    talkingPoints:
      'Cardinal says the update is due this fiscal year and is holding its rate from the last cycle at $6,800. The choice is continuity at a known price versus taking time to test the market.',
    status: 'pending',
  },
  {
    id: 'a4',
    category: 'POLICY',
    decisionHeadline: 'Set a policy for owner EV charger installations',
    background:
      'The owner of Unit 210 has requested approval to install a Level 2 charger in their parking space and asked for the required forms or process. The corporation has no EV policy on file in this corpus.',
    citations: [{ sourceId: 'ev210-03', source: 'Unit 210', date: 'Apr 9' }],
    needsEngineer: false,
    options: [
      {
        id: 'o9',
        title: 'Adopt an interim policy',
        detail: 'Approve case-by-case at owner cost while a full policy is drafted.',
        meta: '',
        isManagerSuggestion: true,
      },
      {
        id: 'o10',
        title: 'Order an electrical capacity study',
        detail: 'Assess building load before approving installations.',
        meta: 'Cost to be quoted',
        isManagerSuggestion: false,
      },
      {
        id: 'o11',
        title: 'Defer pending legal review',
        detail: 'Draft a formal policy before any approval.',
        meta: 'Slower',
        isManagerSuggestion: false,
      },
    ],
    talkingPoints:
      'One concrete request from Unit 210 and no policy to answer it with. An interim case-by-case approval at owner cost lets 210 proceed while a durable policy is drafted.',
    status: 'pending',
  },
  {
    id: 'a5',
    category: 'FINANCE',
    decisionHeadline: 'Determine next steps on two units 60+ days in arrears',
    background:
      'Units 312 and 808 are each more than 60 days past due on common expenses, totalling $9,240, and have missed two consecutive notices.',
    citations: [{ sourceId: 'arrears-04', source: 'Accounts ledger', date: 'Apr 30' }],
    needsEngineer: false,
    options: [
      {
        id: 'o12',
        title: 'Offer a payment plan, then lien',
        detail: 'Set a dated plan; register a lien if it is missed.',
        meta: 'Balanced',
        isManagerSuggestion: true,
      },
      {
        id: 'o13',
        title: 'Register liens now',
        detail: "Protect the corporation's position immediately.",
        meta: 'Firm',
        isManagerSuggestion: false,
      },
      {
        id: 'o14',
        title: 'Refer to collections',
        detail: 'Hand both files to counsel.',
        meta: 'Highest cost',
        isManagerSuggestion: false,
      },
    ],
    talkingPoints:
      'Two units, $9,240 combined, both past two missed notices. The options differ in posture: a dated payment plan first, liens immediately, or handing the files to counsel.',
    status: 'pending',
  },
];
