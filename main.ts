// Entry program for the GTA 6 meme on X (Node 22, standard library only).
// The post itself is the entry. All this program does is hand the post's
// address to the grader: it reads POST.json from the repository and writes
// the same bytes to /output/POST.json. The house then reads the post from X.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(botDir, 'POST.json');
const target = join(outputDir, 'POST.json');

mkdirSync(outputDir, { recursive: true });

let payload: Buffer;
try {
  payload = readFileSync(source);
} catch (err) {
  console.error(`cannot read ${source}: ${(err as Error).message}`);
  process.exit(1);
}

writeFileSync(target, payload);

// Sanity check: the file must be a JSON object naming the post's address.
let parsed: unknown;
try {
  parsed = JSON.parse(payload.toString('utf8'));
} catch {
  console.error('POST.json is not valid JSON');
  process.exit(1);
}
if (
  typeof parsed !== 'object' ||
  parsed === null ||
  typeof (parsed as { url?: unknown }).url !== 'string'
) {
  console.error('POST.json has no url string');
  process.exit(1);
}

console.log(`POST.json written to ${target} (${payload.length} bytes)`);
