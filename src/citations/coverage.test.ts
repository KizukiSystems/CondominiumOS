import { describe, expect, it } from 'vitest';
import { assertCoverage, checkCoverage, formatReport, splitSentences } from './engine';
import { UNCITED_MARKER, type CitedBlock } from './model';

// Fictional Maple Court seed sources (Lane A), matching the WP-1.2 fixture ids.
const SOURCES = ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'];

const cited = (path: string, text: string, ...sourceIds: string[]): CitedBlock => ({
  path,
  text,
  citations: sourceIds.map((sourceId) => ({ sourceId })),
});

describe('checkCoverage', () => {
  it('passes fully cited content', () => {
    const report = checkCoverage(
      [
        cited('items[0].headline', 'Award the garage membrane repair, or assess the slab first', 't1', 't2'),
        cited('items[0].background.s1', 'Rideau Roofing quoted $42,000 for a standard recoat.', 't1'),
        cited('items[0].options[0]', 'Commission a structural engineer before awarding any recoat.', 't2'),
      ],
      SOURCES,
    );
    expect(report.ok).toBe(true);
    expect(report.citedCount).toBe(3);
    expect(report.violations).toHaveLength(0);
  });

  it('fails uncited prose (the core violation)', () => {
    const report = checkCoverage(
      [cited('items[0].talkingPoints.s1', 'Market rates have gone up roughly 15 percent.')],
      SOURCES,
    );
    expect(report.ok).toBe(false);
    expect(report.violations[0].kind).toBe('missing-citation');
  });

  it('fails citations that point at sources that do not exist', () => {
    // Regression shape from SALVAGE.md §4: the POC recommended "Cardinal
    // Engineering" for a structural review no source ever mentioned. A claim
    // whose citation cannot resolve to a real document must fail the build.
    const report = checkCoverage(
      [
        cited(
          'items[0].talkingPoints.s2',
          'Strongly advise bringing in Cardinal Engineering.',
          'no-such-doc',
        ),
      ],
      SOURCES,
    );
    expect(report.ok).toBe(false);
    expect(report.violations[0].kind).toBe('unknown-source');
  });

  it('accepts the uncited marker as an honest replacement for prose', () => {
    const report = checkCoverage(
      [{ path: 'items[2].background.s3', text: UNCITED_MARKER, citations: [] }],
      SOURCES,
    );
    expect(report.ok).toBe(true);
    expect(report.uncitedMarkerCount).toBe(1);
  });

  it('rejects the marker when citations are attached anyway', () => {
    const report = checkCoverage(
      [{ path: 'x', text: UNCITED_MARKER, citations: [{ sourceId: 't1' }] }],
      SOURCES,
    );
    expect(report.ok).toBe(false);
    expect(report.violations[0].kind).toBe('marker-with-citations');
  });

  it('rejects the marker mixed into prose', () => {
    const report = checkCoverage(
      [cited('x', `The reserve study is due this year. ${UNCITED_MARKER}`, 't4')],
      SOURCES,
    );
    expect(report.ok).toBe(false);
    expect(report.violations[0].kind).toBe('marker-with-prose');
  });

  it('flags empty blocks', () => {
    const report = checkCoverage([cited('x', '   ')], SOURCES);
    expect(report.ok).toBe(false);
    expect(report.violations[0].detail).toContain('empty block');
  });
});

describe('assertCoverage', () => {
  it('throws a readable report on failure', () => {
    expect(() => assertCoverage([cited('items[4].options[1]', 'Register liens now.')], SOURCES)).toThrow(
      /missing-citation.*items\[4\]\.options\[1\]/s,
    );
  });

  it('returns the report on success', () => {
    const report = assertCoverage([cited('a', 'Units 312 and 808 are 60+ days past due.', 't6')], SOURCES);
    expect(report.ok).toBe(true);
  });
});

describe('formatReport', () => {
  it('summarizes counts and lists violations with paths', () => {
    const report = checkCoverage(
      [cited('items[1].background.s1', 'Unit 504 has complained four times.')],
      SOURCES,
    );
    const text = formatReport(report);
    expect(text).toContain('violations: 1');
    expect(text).toContain('items[1].background.s1');
  });
});

describe('splitSentences', () => {
  it('splits prose into claim-sized sentences deterministically', () => {
    const sentences = splitSentences(
      'Two contractors inspected the membrane. Rideau quoted $42,000. Capital quoted $51,000 and flagged the slab.',
    );
    expect(sentences).toEqual([
      'Two contractors inspected the membrane.',
      'Rideau quoted $42,000.',
      'Capital quoted $51,000 and flagged the slab.',
    ]);
  });

  it('handles single sentences and trims whitespace', () => {
    expect(splitSentences('  One claim only.  ')).toEqual(['One claim only.']);
  });
});
