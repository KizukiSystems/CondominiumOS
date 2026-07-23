import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { IngestResult, IngestWarning, SourceDoc, SourceFormat } from './model';

const SUPPORTED: ReadonlySet<string> = new Set(['.txt', '.md', '.eml', '.json', '.pdf']);

/**
 * Read a dropped folder of files into the source-document model.
 * Deterministic: files are walked recursively and sorted by relative path;
 * ids are stable slugs of the relative path. Nothing is inferred: sender,
 * date, and subject are taken only from what the file itself declares.
 */
export async function ingestDirectory(dir: string): Promise<IngestResult> {
  const files = (await walk(dir, dir)).sort();
  const docs: SourceDoc[] = [];
  const warnings: IngestWarning[] = [];
  const usedIds = new Set<string>();

  for (const relPath of files) {
    const ext = path.extname(relPath).toLowerCase();
    if (path.basename(relPath).startsWith('.')) continue;
    if (!SUPPORTED.has(ext)) {
      warnings.push({ file: relPath, message: `unsupported extension "${ext}", skipped` });
      continue;
    }
    const absPath = path.join(dir, relPath);
    try {
      const parsed = await parseFile(absPath, relPath, ext);
      for (const doc of parsed.docs) {
        docs.push({ ...doc, id: uniqueId(doc.id, usedIds) });
      }
      warnings.push(...parsed.warnings);
    } catch (error) {
      warnings.push({
        file: relPath,
        message: `failed to parse: ${error instanceof Error ? error.message : String(error)}`,
      });
    }
  }

  return { docs, warnings };
}

async function parseFile(absPath: string, relPath: string, ext: string): Promise<IngestResult> {
  const base = { fileName: relPath, id: slug(relPath) };
  switch (ext) {
    case '.txt':
    case '.md': {
      const raw = await fs.readFile(absPath, 'utf8');
      const { headers, body } = sniffHeaders(raw);
      const title = ext === '.md' ? firstMarkdownHeading(body) : undefined;
      return ok({
        ...base,
        format: ext === '.md' ? 'md' : 'txt',
        sender: headers.from,
        date: headers.date,
        subject: headers.subject ?? title,
        body: body.trim(),
      });
    }
    case '.eml': {
      const raw = await fs.readFile(absPath, 'utf8');
      const { headers, body, warnings } = parseEml(raw, relPath);
      return {
        docs: [
          {
            ...base,
            format: 'eml',
            sender: headers.from,
            date: headers.date,
            subject: headers.subject,
            body: body.trim(),
          },
        ],
        warnings,
      };
    }
    case '.json': {
      const raw = await fs.readFile(absPath, 'utf8');
      return parseJsonThreads(raw, base.id, relPath);
    }
    case '.pdf': {
      const buffer = await fs.readFile(absPath);
      const { extractText } = await import('unpdf');
      const { text } = await extractText(new Uint8Array(buffer), { mergePages: true });
      const body = text.trim();
      const warnings: IngestWarning[] =
        body.length === 0
          ? [{ file: relPath, message: 'PDF contained no extractable text (scanned image?)' }]
          : [];
      return { docs: [{ ...base, format: 'pdf', body }], warnings };
    }
    default:
      throw new Error(`unreachable extension ${ext}`);
  }
}

interface SniffedHeaders {
  from?: string;
  date?: string;
  subject?: string;
}

/**
 * Recognize an email-like header block (From:/Date:/Subject:) at the top of
 * a plain-text or markdown file. Stops at the first line that is neither a
 * recognized header nor blank.
 */
function sniffHeaders(raw: string): { headers: SniffedHeaders; body: string } {
  const lines = raw.split(/\r?\n/);
  const headers: SniffedHeaders = {};
  let i = 0;
  for (; i < lines.length; i += 1) {
    const match = /^(from|date|subject):\s*(.*)$/i.exec(lines[i]);
    if (!match) break;
    const key = match[1].toLowerCase() as keyof SniffedHeaders;
    headers[key] = match[2].trim();
  }
  if (i === 0) return { headers: {}, body: raw };
  while (i < lines.length && lines[i].trim() === '') i += 1;
  return { headers, body: lines.slice(i).join('\n') };
}

function parseEml(
  raw: string,
  relPath: string,
): { headers: SniffedHeaders; body: string; warnings: IngestWarning[] } {
  const warnings: IngestWarning[] = [];
  const splitAt = raw.search(/\r?\n\r?\n/);
  const headerBlock = splitAt === -1 ? raw : raw.slice(0, splitAt);
  const body = splitAt === -1 ? '' : raw.slice(splitAt).replace(/^\r?\n\r?\n/, '');
  // Unfold RFC 5322 continuation lines, then pick the headers we keep.
  const unfolded = headerBlock.replace(/\r?\n[ \t]+/g, ' ');
  const headers: SniffedHeaders = {};
  for (const line of unfolded.split(/\r?\n/)) {
    const match = /^(from|date|subject):\s*(.*)$/i.exec(line);
    if (match) {
      headers[match[1].toLowerCase() as keyof SniffedHeaders] = match[2].trim();
    }
  }
  if (/content-type:\s*multipart\//i.test(unfolded)) {
    warnings.push({
      file: relPath,
      message: 'multipart MIME message; body kept raw (no part decoding yet)',
    });
  }
  return { headers, body, warnings };
}

/**
 * A .json drop is a thread export: one object or an array of objects shaped
 * {sender?, date?, subject?, body}. Matches the POC mock-thread shape so the
 * WP-1.2 fixture seed ports directly.
 */
function parseJsonThreads(raw: string, baseId: string, relPath: string): IngestResult {
  const parsed: unknown = JSON.parse(raw);
  const items = Array.isArray(parsed) ? parsed : [parsed];
  const docs: SourceDoc[] = [];
  const warnings: IngestWarning[] = [];
  items.forEach((item, index) => {
    if (typeof item !== 'object' || item === null || typeof (item as { body?: unknown }).body !== 'string') {
      warnings.push({ file: relPath, message: `entry ${index} has no string "body", skipped` });
      return;
    }
    const entry = item as { sender?: unknown; date?: unknown; subject?: unknown; body: string };
    docs.push({
      id: items.length === 1 ? baseId : `${baseId}-${index + 1}`,
      fileName: relPath,
      format: 'json' satisfies SourceFormat,
      sender: asString(entry.sender),
      date: asString(entry.date),
      subject: asString(entry.subject),
      body: entry.body.trim(),
    });
  });
  return { docs, warnings };
}

function firstMarkdownHeading(body: string): string | undefined {
  const match = /^#{1,6}\s+(.+)$/m.exec(body);
  return match?.[1].trim();
}

function slug(relPath: string): string {
  const withoutExt = relPath.slice(0, relPath.length - path.extname(relPath).length);
  return withoutExt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function uniqueId(id: string, used: Set<string>): string {
  let candidate = id;
  let n = 2;
  while (used.has(candidate)) {
    candidate = `${id}-${n}`;
    n += 1;
  }
  used.add(candidate);
  return candidate;
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function ok(doc: SourceDoc): IngestResult {
  return { docs: [doc], warnings: [] };
}

async function walk(root: string, current: string): Promise<string[]> {
  const entries = await fs.readdir(current, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const abs = path.join(current, entry.name);
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.')) files.push(...(await walk(root, abs)));
    } else if (entry.isFile()) {
      files.push(path.relative(root, abs));
    }
  }
  return files;
}
