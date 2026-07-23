import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { ingestDirectory } from './ingest';

// All fixture content is fictional Maple Court material (Lane A).
let dir: string;

beforeAll(async () => {
  dir = await fs.mkdtemp(path.join(os.tmpdir(), 'concierge-ingest-'));
  const write = (name: string, content: string) => {
    const abs = path.join(dir, name);
    return fs
      .mkdir(path.dirname(abs), { recursive: true })
      .then(() => fs.writeFile(abs, content, 'utf8'));
  };
  await Promise.all([
    write(
      'rideau-roofing.txt',
      'From: Rideau Roofing\nDate: Apr 12\nSubject: P1 Garage Membrane Inspection Quote\n\nQuote $42,000 for a standard recoat.',
    ),
    write('notes/reserve-study.md', '# Reserve Fund Study Renewal\n\nAn update is due this fiscal year.'),
    write(
      'unit-504.eml',
      'From: Owner, Unit 504\r\nDate: Apr 3\r\nSubject: Noise Complaint -\r\n Unit 511\r\nContent-Type: multipart/mixed; boundary="b"\r\n\r\nFourth complaint since February.',
    ),
    write(
      'threads.json',
      JSON.stringify([
        { sender: 'Owner, Unit 210', date: 'Apr 9', subject: 'EV Charger Request', body: 'Requesting approval.' },
        { sender: 'Accounts ledger', date: 'Apr 30', subject: 'Past Due Accounts', body: '$9,240 total.' },
        { date: 'Apr 1', subject: 'broken entry' },
      ]),
    ),
    write('image.png', 'not-actually-ingestable'),
    write('plain.txt', 'No headers here, just body text.'),
  ]);
});

afterAll(async () => {
  await fs.rm(dir, { recursive: true, force: true });
});

describe('ingestDirectory', () => {
  it('reads a dropped folder into source docs, deterministically ordered', async () => {
    const result = await ingestDirectory(dir);
    expect(result.docs.map((d) => d.id)).toEqual([
      'notes-reserve-study',
      'plain',
      'rideau-roofing',
      'threads-1',
      'threads-2',
      'unit-504',
    ]);
  });

  it('parses email-style headers from txt files', async () => {
    const { docs } = await ingestDirectory(dir);
    const doc = docs.find((d) => d.id === 'rideau-roofing');
    expect(doc?.sender).toBe('Rideau Roofing');
    expect(doc?.date).toBe('Apr 12');
    expect(doc?.subject).toBe('P1 Garage Membrane Inspection Quote');
    expect(doc?.body).toBe('Quote $42,000 for a standard recoat.');
  });

  it('takes markdown titles as subject and keeps the body intact', async () => {
    const { docs } = await ingestDirectory(dir);
    const doc = docs.find((d) => d.id === 'notes-reserve-study');
    expect(doc?.subject).toBe('Reserve Fund Study Renewal');
    expect(doc?.body).toContain('due this fiscal year');
  });

  it('parses .eml with folded headers and flags multipart bodies', async () => {
    const result = await ingestDirectory(dir);
    const doc = result.docs.find((d) => d.fileName === 'unit-504.eml');
    expect(doc?.sender).toBe('Owner, Unit 504');
    expect(doc?.subject).toBe('Noise Complaint - Unit 511');
    expect(doc?.body).toBe('Fourth complaint since February.');
    expect(result.warnings.some((w) => w.file === 'unit-504.eml' && /multipart/.test(w.message))).toBe(true);
  });

  it('expands a JSON thread export into one doc per entry and flags bad entries', async () => {
    const result = await ingestDirectory(dir);
    const t1 = result.docs.find((d) => d.id === 'threads-1');
    expect(t1?.sender).toBe('Owner, Unit 210');
    expect(t1?.date).toBe('Apr 9');
    expect(result.warnings.some((w) => w.file === 'threads.json' && /entry 2/.test(w.message))).toBe(true);
  });

  it('never invents metadata: headerless files get body only', async () => {
    const { docs } = await ingestDirectory(dir);
    const doc = docs.find((d) => d.id === 'plain');
    expect(doc?.sender).toBeUndefined();
    expect(doc?.date).toBeUndefined();
    expect(doc?.body).toBe('No headers here, just body text.');
  });

  it('skips unsupported extensions with a warning instead of failing', async () => {
    const result = await ingestDirectory(dir);
    expect(result.docs.some((d) => d.fileName === 'image.png')).toBe(false);
    expect(result.warnings.some((w) => w.file === 'image.png' && /unsupported/.test(w.message))).toBe(true);
  });

  it('produces ids usable as citation targets (stable slugs, unique)', async () => {
    const { docs } = await ingestDirectory(dir);
    const ids = docs.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });
});
