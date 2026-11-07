// Guard checks for spec.md §9 criteria that no other tool covers. Run after `npm run build`.
//  6  every spec §2 route exists in both locales; each page has <html lang> + hreflang tr/en/x-default
//  9  RSS shape for /tr/rss.xml and /en/rss.xml
// 11  raw colors / px only in src/styles/tokens.css (CSS and <style> blocks)
// 13  no unapproved personal data in dist (second email, address, age/birth wording)
//  +  WCAG contrast of the token pairs (screen and print palettes)
// Prints failures + a summary; exits non-zero on any failure.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const LANGS = ['tr', 'en'];
const PUBLIC_EMAIL = 'emirhandurmuskaya@gmail.com';
const problems = [];
const fail = (area, msg) => problems.push(`${area}: ${msg}`);
const rel = (p) => relative('.', p).replace(/\\/g, '/');

function files(dir, filter = () => true) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p, filter) : filter(p) ? [p] : [];
  });
}

if (!existsSync('dist/index.html')) {
  console.log('FAIL guard: dist/ not found; run `npm run build` first');
  process.exit(1);
}

// ---- 11. raw design values outside tokens.css -------------------------------
const RAW = [
  { re: /#[0-9a-fA-F]{3,8}\b/g, what: 'hex color' },
  { re: /\b\d*\.?\d+px\b/g, what: 'px value' },
  { re: /\b(?:rgb|rgba|hsl|hsla|oklch)\(/g, what: 'color function' },
];
for (const f of files('src', (p) => /\.(css|astro)$/.test(p))) {
  if (f.replace(/\\/g, '/').endsWith('src/styles/tokens.css')) continue;
  const src = readFileSync(f, 'utf8');
  const css = f.endsWith('.css')
    ? [src]
    : [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  for (const block of css) {
    const code = block.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const { re, what } of RAW)
      for (const m of code.matchAll(re)) fail('tokens', `${rel(f)} has a raw ${what} "${m[0]}"`);
  }
}

// ---- 6. routes + lang + hreflang -------------------------------------------
const slugs = (c, l) =>
  files(join('src/content', c, l), (p) => /\.mdx?$/.test(p)).map((p) =>
    relative(join('src/content', c, l), p)
      .replace(/\\/g, '/')
      .replace(/\.mdx?$/, ''),
  );
const required = ['index.html', '404.html'];
for (const l of LANGS) {
  for (const r of ['', 'about/', 'resume/', 'contact/', 'projects/', 'blog/'])
    required.push(`${l}/${r}index.html`);
  required.push(`${l}/rss.xml`, `../public/resume-${l}.pdf`);
  for (const s of slugs('projects', l)) required.push(`${l}/projects/${s}/index.html`);
  for (const s of slugs('blog', l)) required.push(`${l}/blog/${s}/index.html`);
}
for (const r of required) if (!existsSync(join('dist', r))) fail('routes', `missing dist/${r}`);

// Same pages in both locales (tag pages differ per language by design).
const pagesOf = (l) =>
  files(join('dist', l), (p) => p.endsWith('.html'))
    .map((p) => relative(join('dist', l), p).replace(/\\/g, '/'))
    .filter((p) => !p.startsWith('blog/tags/'));
const [trPages, enPages] = LANGS.map((l) => new Set(pagesOf(l)));
for (const p of trPages) if (!enPages.has(p)) fail('routes', `${p} exists in tr but not en`);
for (const p of enPages) if (!trPages.has(p)) fail('routes', `${p} exists in en but not tr`);

const html = files('dist', (p) => p.endsWith('.html'));
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  const lang = s.match(/<html[^>]*\slang="([^"]+)"/)?.[1];
  const expected = rel(f).match(/^dist\/(tr|en)\//)?.[1] ?? 'tr';
  if (lang !== expected) fail('lang', `${rel(f)} has lang="${lang}", expected "${expected}"`);
  for (const h of ['tr', 'en', 'x-default'])
    if (!new RegExp(`<link[^>]+rel="alternate"[^>]+hreflang="${h}"`).test(s))
      fail('hreflang', `${rel(f)} has no hreflang="${h}"`);
  if ((s.match(/<h1[\s>]/g) ?? []).length !== 1) fail('a11y', `${rel(f)} does not have exactly one <h1>`);
}

// ---- 9. RSS shape ------------------------------------------------------------
for (const l of LANGS) {
  const p = join('dist', l, 'rss.xml');
  if (!existsSync(p)) continue;
  const x = readFileSync(p, 'utf8');
  for (const tag of [
    '<rss version="2.0"',
    '<channel>',
    '<title>',
    '<link>',
    '<description>',
    `<language>${l}`,
  ])
    if (!x.includes(tag)) fail('rss', `${l}/rss.xml lacks ${tag}`);
  const items = [...x.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  const posts = slugs('blog', l).length;
  if (items.length !== posts) fail('rss', `${l}/rss.xml has ${items.length} items, expected ${posts}`);
  items.forEach((it, i) => {
    for (const tag of ['<title>', '<link>https://', '<guid', '<pubDate>'])
      if (!it.includes(tag)) fail('rss', `${l}/rss.xml item ${i + 1} lacks ${tag}`);
  });
}

// ---- 13. unapproved personal data in dist -----------------------------------
// The real values are deliberately not in the repo; these patterns catch them generically.
const BANNED = [
  {
    re: /[\w.+-]+@[\w-]+\.[\w.-]+/g,
    what: 'email other than the public one',
    allow: (m) => m === PUBLIC_EMAIL,
  },
  { re: /\b\d{1,2}\s*(?:yaşında|years?\s+old)\b/gi, what: 'age' },
  { re: /doğum tarihi|date of birth|born (?:on|in)\b/gi, what: 'birth date wording' },
  { re: /\b\d{1,2}\.\s*sınıf\b|\b\d{1,2}(?:st|nd|rd|th)[\s-]grade\b/gi, what: 'school grade' },
];
for (const f of files('dist', (p) => /\.(html|xml|txt|json)$/.test(p))) {
  const s = readFileSync(f, 'utf8');
  for (const { re, what, allow } of BANNED)
    for (const m of s.matchAll(re))
      if (!allow?.(m[0])) fail('privacy', `${rel(f)} contains ${what}: "${m[0]}"`);
}

// ---- Contrast of token pairs -------------------------------------------------
const tokensCss = readFileSync('src/styles/tokens.css', 'utf8');
const palette = (block) =>
  Object.fromEntries([...block.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));
const screen = palette(tokensCss.split('@media')[0]);
const print = { ...screen, ...palette(tokensCss.match(/@media print\s*{([\s\S]*?)}\s*}/)?.[1] ?? '') };

const hex = (v) => {
  const h = v.replace('#', '');
  const n = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
};
// rgb(255 255 255 / 0.06) composited over a base color
const color = (v, base) => {
  if (v.startsWith('#')) return hex(v);
  const m = v.match(/rgb\((\d+)\s+(\d+)\s+(\d+)\s*\/\s*([\d.]+)\)/);
  if (!m || !base) return null;
  const a = Number(m[4]);
  return [1, 2, 3].map((i, k) => Math.round(Number(m[i]) * a + base[k] * (1 - a)));
};
const lum = (c) => 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2]);
function ch(v) {
  const s = v / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const contrasts = [];
for (const [name, p] of [
  ['screen', screen],
  ['print', print],
]) {
  const bg = hex(p.bg);
  const surface = color(p['surface-strong'], bg) ?? bg;
  const pairs = [
    ['text', 'bg', 7],
    ['text-muted', 'bg', 4.5],
    ['accent', 'bg', 4.5],
    ['text', 'surface-strong', 7],
    ['text-muted', 'surface-strong', 4.5],
    ['accent', 'surface-strong', 4.5],
    ['accent-ink', 'accent', 4.5],
  ];
  for (const [fg, bgName, min] of pairs) {
    const back = bgName === 'bg' ? bg : bgName === 'surface-strong' ? surface : hex(p[bgName]);
    const r = ratio(hex(p[fg]), back);
    contrasts.push(`${name} ${fg}/${bgName} ${r.toFixed(2)}:1`);
    if (r < min) fail('contrast', `${name} --${fg} on --${bgName} is ${r.toFixed(2)}:1 (< ${min}:1)`);
  }
}

problems.forEach((p) => console.log(`FAIL ${p}`));
console.log(`contrast: ${contrasts.join(' · ')}`);
console.log(
  `guard: ${problems.length ? `${problems.length} problems` : 'all passed'} (${html.length} pages, ${required.length} required routes)`,
);
process.exit(problems.length ? 1 : 0);
