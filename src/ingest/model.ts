// Source-document model: what everything downstream (classification,
// generation, citations) consumes. Ingest is universal and manual in v0.x:
// a dropped folder of files, no account access, no integrations (ratified
// 2026-07-23; Build Spec §2 invariant).

export type SourceFormat = 'txt' | 'md' | 'eml' | 'json' | 'pdf';

export interface SourceDoc {
  /** Stable slug derived from the file name; the citation target. */
  id: string;
  /** Path relative to the drop folder. */
  fileName: string;
  format: SourceFormat;
  /** Who the material is from, when the source says so. Never inferred. */
  sender?: string;
  /** Date as written in the source. Never inferred, never reformatted. */
  date?: string;
  subject?: string;
  body: string;
}

export interface IngestWarning {
  file: string;
  message: string;
}

export interface IngestResult {
  /** Deterministic order: sorted by relative file path. */
  docs: SourceDoc[];
  warnings: IngestWarning[];
}
