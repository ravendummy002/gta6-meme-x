// gta6-meme-x-01 entry for @ravendummy: the entry is the X post itself, so
// this program only hands POST.json (the post's address on X) to the grader.
// The house reads the post from X and builds the judge's dossier from its
// first picture and its text; nothing this program writes is judged.
// Node 22, standard library only, no network, deterministic: two runs write
// identical bytes.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message: string): never {
  console.error(`gta6-meme-x-01: ${message}`);
  process.exit(1);
}

// Read the post file from the repository root and make sure it is a JSON
// object naming one X post address before handing it on.
const raw = readFileSync(join(BOT_DIR, 'POST.json'), 'utf8');
let post: unknown;
try {
  post = JSON.parse(raw);
} catch {
  fail('POST.json is not valid JSON');
}
if (typeof post !== 'object' || post === null || Array.isArray(post)) {
  fail('POST.json must be a JSON object');
}
const url = (post as Record<string, unknown>).url;
if (typeof url !== 'string' || url.length === 0) {
  fail('POST.json must hold a url string');
}
// The gate only accepts an X post address; refuse anything else here so a
// bad POST.json fails fast locally instead of at submission time.
if (!/^https:\/\/(www\.|mobile\.)?(x\.com|twitter\.com)\/(i\/web\/status\/\d+|[^/]+\/status(es)?\/\d+)/.test(url)) {
  fail('POST.json url must be an X post address (https://x.com/<handle>/status/<id>)');
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'POST.json'), raw);
