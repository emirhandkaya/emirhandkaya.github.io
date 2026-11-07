// Renders public/og-default.png (1200×630), a typographic card (plan.md M4).
// Colors, fonts and spacing come from src/styles/tokens.css; no raw design values here.
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import { findChrome } from './lib/chrome.mjs';

const href = (p) => pathToFileURL(resolve(p)).href;
const css = [
  'src/styles/tokens.css',
  'node_modules/@fontsource-variable/inter/index.css',
  'node_modules/@fontsource-variable/jetbrains-mono/index.css',
];

// Text is language-neutral (the image serves both locales); facts per research/profile-notes.md.
const html = `<!doctype html><html lang="tr"><head><meta charset="utf-8">
${css.map((c) => `<link rel="stylesheet" href="${href(c)}">`).join('\n')}
<style>
  html, body { margin: 0; width: 1200px; height: 630px; }
  body { background: var(--bg); color: var(--text); font-family: var(--font-sans);
         display: grid; padding: var(--space-8); box-sizing: border-box; }
  .frame { border: var(--border-w) solid var(--border); border-radius: var(--radius);
           background: var(--surface); padding: var(--space-8); display: grid; align-content: space-between; }
  .mark { width: 4rem; height: 4rem; display: grid; place-items: center; border-radius: var(--radius-sm);
          background: var(--accent); color: var(--accent-ink); font: 700 1.5rem var(--font-mono); }
  h1 { font-size: 5.25rem; line-height: var(--leading-tight); letter-spacing: var(--tracking-tight); margin: 0; }
  .role { font: 500 1.6rem var(--font-mono); color: var(--accent); margin: var(--space-4) 0 0; }
  .foot { display: flex; justify-content: space-between; font: 1.3rem var(--font-mono); color: var(--text-muted); }
</style></head><body><div class="frame">
  <div class="mark">ED</div>
  <div><h1>Emirhan Durmuşkaya</h1><p class="role">Valmeto · Turing Robotics · FRC #10141</p></div>
  <div class="foot"><span>emirhandurmuskaya.com</span><span>TR / EN</span></div>
</div></body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'og-'));
const file = join(dir, 'og.html');
writeFileSync(file, html);

const browser = await puppeteer.launch({
  executablePath: findChrome(),
  headless: true,
  args: ['--allow-file-access-from-files'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(file).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/og-default.png', type: 'png' });
  console.log('PASS public/og-default.png (1200×630)');
} finally {
  await browser.close();
  rmSync(dir, { recursive: true, force: true });
}
