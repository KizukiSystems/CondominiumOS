// Citation data model (Build Spec §2 data-model invariant).
// The invariant: no generated claim without at least one Citation; generation
// that cannot cite emits the marker below INSTEAD of prose. Coverage is a
// test, not a style.

/** The exact string generation must emit when it cannot cite. */
export const UNCITED_MARKER = '[uncited — needs source]';

export interface Citation {
  /** Must resolve to a known source document id. */
  sourceId: string;
  /** Display label, e.g. "Rideau Roofing". */
  source?: string;
  /** Display date, e.g. "Apr 12". */
  date?: string;
}

/**
 * One checkable unit of generated content: a claim-sized piece of prose and
 * the citations that ground it. The pipeline is responsible for producing
 * blocks at claim granularity (one sentence of background, one option, one
 * headline); the engine checks whatever granularity it is given.
 */
export interface CitedBlock {
  /** Logical location for error reporting, e.g. "items[0].background.s2". */
  path: string;
  text: string;
  citations: Citation[];
}

export type ViolationKind =
  /** Prose with no citations and no uncited marker. The core violation. */
  | 'missing-citation'
  /** A citation points at a source id that does not exist in the corpus. */
  | 'unknown-source'
  /** The uncited marker used, but citations attached anyway (contradiction). */
  | 'marker-with-citations'
  /** The marker mixed into prose. Canon: the marker replaces prose entirely. */
  | 'marker-with-prose';

export interface Violation {
  kind: ViolationKind;
  path: string;
  detail: string;
}

export interface CoverageReport {
  ok: boolean;
  blockCount: number;
  /** Blocks grounded by at least one valid citation. */
  citedCount: number;
  /** Blocks that honestly declared themselves uncited via the marker. */
  uncitedMarkerCount: number;
  violations: Violation[];
}
