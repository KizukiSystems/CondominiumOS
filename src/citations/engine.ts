import type { CitedBlock, CoverageReport, Violation } from './model';
import { UNCITED_MARKER } from './model';

/**
 * Check every block against the citation invariant:
 * - prose must carry at least one citation, or be exactly the uncited marker;
 * - every citation must resolve to a known source id;
 * - the marker replaces prose entirely and carries no citations.
 */
export function checkCoverage(
  blocks: readonly CitedBlock[],
  knownSourceIds: Iterable<string>,
): CoverageReport {
  const known = new Set(knownSourceIds);
  const violations: Violation[] = [];
  let citedCount = 0;
  let uncitedMarkerCount = 0;

  for (const block of blocks) {
    const text = block.text.trim();
    const isMarker = text === UNCITED_MARKER;
    const containsMarker = !isMarker && text.includes(UNCITED_MARKER);

    let sourcesValid = block.citations.length > 0;
    for (const citation of block.citations) {
      if (!known.has(citation.sourceId)) {
        sourcesValid = false;
        violations.push({
          kind: 'unknown-source',
          path: block.path,
          detail: `citation "${citation.sourceId}" does not match any source document`,
        });
      }
    }

    if (isMarker) {
      if (block.citations.length > 0) {
        violations.push({
          kind: 'marker-with-citations',
          path: block.path,
          detail: 'block is the uncited marker but carries citations; drop the marker or the citations',
        });
      } else {
        uncitedMarkerCount += 1;
      }
      continue;
    }

    if (containsMarker) {
      violations.push({
        kind: 'marker-with-prose',
        path: block.path,
        detail: 'the uncited marker must replace prose entirely, not be mixed into it',
      });
      continue;
    }

    if (block.citations.length === 0) {
      violations.push({
        kind: 'missing-citation',
        path: block.path,
        detail: text.length === 0 ? 'empty block with no citations' : `uncited prose: "${truncate(text)}"`,
      });
      continue;
    }

    if (sourcesValid) citedCount += 1;
  }

  return {
    ok: violations.length === 0,
    blockCount: blocks.length,
    citedCount,
    uncitedMarkerCount,
    violations,
  };
}

/** Throw with a readable report when coverage fails. The pipeline's hard gate. */
export function assertCoverage(
  blocks: readonly CitedBlock[],
  knownSourceIds: Iterable<string>,
): CoverageReport {
  const report = checkCoverage(blocks, knownSourceIds);
  if (!report.ok) {
    throw new Error(`Citation coverage failed.\n${formatReport(report)}`);
  }
  return report;
}

export function formatReport(report: CoverageReport): string {
  const lines = [
    `blocks: ${report.blockCount} · cited: ${report.citedCount} · marked uncited: ${report.uncitedMarkerCount} · violations: ${report.violations.length}`,
  ];
  for (const v of report.violations) {
    lines.push(`  [${v.kind}] ${v.path}: ${v.detail}`);
  }
  return lines.join('\n');
}

/**
 * Deterministic, deliberately simple sentence splitter for turning generated
 * prose into claim-sized blocks. Splits on sentence-ending punctuation
 * followed by whitespace and an upper-case/numeric/quote start. Known limit:
 * abbreviations ("Eng.", "approx.") can over-split; the pipeline should
 * prefer per-sentence generation over post-hoc splitting where possible.
 */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=["'([]?[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function truncate(text: string, max = 60): string {
  return text.length <= max ? text : `${text.slice(0, max)}...`;
}
