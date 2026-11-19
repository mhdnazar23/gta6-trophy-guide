// Platinum Road — the entrypoint the grader runs (Node 22, standard
// library only). The guide itself is the static app/ folder: a browser
// opens app/index.html, it loads nothing over the network, and its trophy
// list lives in app/data/trophies.json. This program hands it in: it copies
// app/ and screenshots/ from beside this file into the output directory
// and writes /output/dossier.json with the vendored make.fun library.
// vendor/makefun-frontend.ts must stay exactly as the kit ships it — the
// scorer requires dossier.json to be byte for byte what its own copy
// writes, so do not edit that file.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// (outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outDir, { recursive: true });
cpSync(join(here, 'app'), join(outDir, 'app'), { recursive: true });
mkdirSync(join(outDir, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });
}

// The caps below are the scorer's own: text_max_bytes is the only one
// that shapes the dossier bytes. The others refuse an entry the scorer
// would refuse — more than 4 screenshots, one over 256 KiB, or an app/
// bigger than 993 files and directories / 48 MiB.
writeFileSync(
  join(outDir, 'dossier.json'),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
console.log(`Platinum Road written to ${outDir}`);
