// Display types for the demo UI, ported from Concierge-OG per SALVAGE.md §3
// (KEEP, amended). Amendments: Citation carries sourceId (aligned with
// src/citations/model.ts), pack status is draft/final (no fake "published"
// state), and the stakeholder/minutes extras were trimmed pending the gate.
// The five-category structure assumes the board-prep wedge and may retarget
// after Friday (ROADMAP §3a item 5 note).

export interface Thread {
  id: string;
  sender: string;
  date: string;
  subject: string;
  body: string;
}

export interface Citation {
  sourceId: string;
  source: string;
  date: string;
}

export interface Option {
  id: string;
  title: string;
  detail: string;
  /** Cost/timeline/posture tag. Only source-grounded figures allowed here. */
  meta: string;
  /** Set from manager input only, never model-assigned (repair rule 2). */
  isManagerSuggestion: boolean;
}

export interface AgendaItem {
  id: string;
  category: 'MAINTENANCE' | 'COMPLIANCE' | 'RESERVE FUND' | 'POLICY' | 'FINANCE';
  decisionHeadline: string;
  background: string;
  citations: Citation[];
  needsEngineer: boolean;
  options: Option[];
  selectedOptionId?: string;
  talkingPoints: string;
  status: 'pending' | 'approved';
}

export interface BoardPack {
  id: string;
  title: string;
  meetingDate: string;
  generatedDate: string;
  /** 'final' means reviewed and frozen. Nothing is ever sent or filed. */
  status: 'draft' | 'final';
  agendaItems: AgendaItem[];
}
