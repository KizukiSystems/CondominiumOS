import { promises as fs } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { checkCoverage } from '../citations/engine';
import type { CitedBlock } from '../citations/model';
import { cachedAgendaItems, seedThreads } from './data/demoSeed';

describe('cached demo data honors the citation invariant', () => {
  const knownIds = seedThreads.map((t) => t.id);

  it('every agenda item, background, option, and talking point resolves to real sources', () => {
    const blocks: CitedBlock[] = cachedAgendaItems.flatMap((item) => [
      { path: `${item.id}.headline`, text: item.decisionHeadline, citations: item.citations.map(toEngine) },
      { path: `${item.id}.background`, text: item.background, citations: item.citations.map(toEngine) },
      { path: `${item.id}.talkingPoints`, text: item.talkingPoints, citations: item.citations.map(toEngine) },
      ...item.options.map((option, i) => ({
        path: `${item.id}.options[${i}]`,
        text: `${option.title}. ${option.detail}`,
        citations: item.citations.map(toEngine),
      })),
    ]);
    const report = checkCoverage(blocks, knownIds);
    expect(report.violations).toEqual([]);
    expect(report.ok).toBe(true);
  });

  it('citation display fields match the source documents they point at', () => {
    for (const item of cachedAgendaItems) {
      for (const citation of item.citations) {
        const source = seedThreads.find((t) => t.id === citation.sourceId);
        expect(source, `${item.id} cites unknown source ${citation.sourceId}`).toBeDefined();
        expect(source?.date).toBe(citation.date);
      }
    }
  });

  it('exactly one manager suggestion per item, never more', () => {
    for (const item of cachedAgendaItems) {
      expect(item.options.filter((o) => o.isManagerSuggestion)).toHaveLength(1);
    }
  });
});

describe('repair rule 1: the real management company never appears in code or fixtures', () => {
  it('no CMG reference anywhere under src/ or fixtures/', async () => {
    const roots = ['src', 'fixtures'];
    const offenders: string[] = [];
    const self = path.resolve(__dirname, 'demoSeed.test.ts');
    for (const root of roots) {
      for (const file of await walk(path.resolve(__dirname, '../../', root))) {
        if (file === self) continue; // the checker necessarily names the pattern
        const content = await fs.readFile(file, 'utf8');
        if (/\bCMG\b/i.test(content)) offenders.push(file);
      }
    }
    expect(offenders).toEqual([]);
  });
});

function toEngine(citation: { sourceId: string; source: string; date: string }) {
  return { sourceId: citation.sourceId, source: citation.source, date: citation.date };
}

async function walk(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(abs)));
    else if (/\.(ts|tsx|json|md|css|html)$/.test(entry.name)) files.push(abs);
  }
  return files;
}
