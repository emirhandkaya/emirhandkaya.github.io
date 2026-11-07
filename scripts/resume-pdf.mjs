// Prints /{lang}/resume/ from dist/ to public/resume-{lang}.pdf (plan.md M4).
// Run via `npm run resume-pdf` (builds first, then rebuilds so dist/ has the PDFs).
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import puppeteer from 'puppeteer-core';
import { findChrome } from './lib/chrome.mjs';

const DIST = resolve('dist');
const LANGS = ['tr', 'en'];
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.pdf': 'application/pdf',
};

if (!existsSync(join(DIST, 'tr', 'resume', 'index.html'))) {
  console.error('FAIL dist/ has no resume page; run `npm run build` first.');
  process.exit(1);
}

// Minimal static server for dist/ (no extra dependency).
const server = createServer((req, res) => {
  let path;
  try {
    path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  } catch {
    return res.writeHead(400).end();
  }
  let file = normalize(join(DIST, path));
  if (file !== DIST && !file.startsWith(DIST + sep)) return res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());

const browser = await puppeteer.launch({ executablePath: findChrome(), headless: true });
let failed = 0;
try {
  const page = await browser.newPage();
  for (const lang of LANGS) {
    const url = `http://127.0.0.1:${port}/${lang}/resume/`;
    const res = await page.goto(url, { waitUntil: 'networkidle0' });
    if (!res?.ok()) {
      console.error(`FAIL ${url} → ${res?.status()}`);
      failed++;
      continue;
    }
    await page.emulateMediaType('print');
    await page.evaluate(() => document.fonts.ready);
    const out = `public/resume-${lang}.pdf`;
    await page.pdf({
      path: out,
      format: 'A4',
      printBackground: true,
      margin: { top: '16mm', bottom: '16mm', left: '16mm', right: '16mm' },
    });
    console.log(`PASS ${out}`);
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`resume-pdf: ${failed ? `${failed} failing` : 'all written'}`);
process.exit(failed ? 1 : 0);
