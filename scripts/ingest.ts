// Manual file-drop ingest, from the shell:
//   npm run ingest -- <folder>
// Prints what was read and every warning. Reads only; writes nothing.
import { ingestDirectory } from '../src/ingest/ingest';

const dir = process.argv[2];
if (!dir) {
  console.error('usage: npm run ingest -- <folder-of-dropped-files>');
  process.exit(2);
}

ingestDirectory(dir)
  .then((result) => {
    for (const doc of result.docs) {
      const meta = [doc.sender, doc.date].filter(Boolean).join(' · ');
      console.log(`${doc.id}  (${doc.format})  ${meta}${meta ? '  ' : ''}${doc.subject ?? ''}`);
    }
    console.log(`\n${result.docs.length} document(s), ${result.warnings.length} warning(s)`);
    for (const warning of result.warnings) {
      console.warn(`  warning: ${warning.file}: ${warning.message}`);
    }
  })
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
