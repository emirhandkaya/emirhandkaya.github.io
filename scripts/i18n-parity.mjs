// Fails if any UI key, page, or content entry exists in one language but not the other,
// or if translations of an entry disagree on shared frontmatter (date, canonicalUrl, …).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const LANGS = ['tr', 'en'];
const problems = [];

function flatKeys(obj, prefix = '') {
  return Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' ? flatKeys(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );
}
function files(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}
function compare(label, sets) {
  const [a, b] = LANGS.map((l) => new Set(sets[l]));
  for (const x of a) if (!b.has(x)) problems.push(`${label}: "${x}" missing in en`);
  for (const x of b) if (!a.has(x)) problems.push(`${label}: "${x}" missing in tr`);
}

// 1. UI strings: src/i18n/{tr,en}.json
const ui = {};
for (const l of LANGS) {
  const p = `src/i18n/${l}.json`;
  ui[l] = existsSync(p) ? flatKeys(JSON.parse(readFileSync(p, 'utf8'))) : [];
  if (!existsSync(p)) problems.push(`ui: ${p} not found`);
}
compare('ui key', ui);

// 2. Pages: localized pages live once in src/pages/[lang]/ and must build for every locale,
//    i.e. their getStaticPaths iterates LANGS. (Built-page parity in dist/ is checked by guard.mjs.)
for (const f of files('src/pages/[lang]').filter((p) => /\.(astro|ts|md|mdx)$/.test(p))) {
  const src = readFileSync(f, 'utf8');
  if (!/getStaticPaths/.test(src) || !/\bLANGS\b/.test(src))
    problems.push(
      `page: ${f.replace(/\\/g, '/')} does not build for every locale (getStaticPaths over LANGS)`,
    );
}
for (const l of LANGS)
  if (existsSync(`src/pages/${l}`))
    problems.push(`page: src/pages/${l}/ exists; put localized pages in src/pages/[lang]/`);

// Frontmatter fields that must be identical in both languages of an entry.
const SHARED = ['date', 'updated', 'canonicalUrl', 'status', 'featured', 'order', 'draft'];
function frontmatter(p) {
  const m = readFileSync(p, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*?)\s*(?:#.*)?$/);
    if (kv) out[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
  }
  return out;
}

// 3. Content: src/content/<collection>/{tr,en}/** (translations share a slug)
if (existsSync('src/content')) {
  for (const c of readdirSync('src/content')) {
    const base = join('src/content', c);
    if (!statSync(base).isDirectory()) continue;
    const entries = {};
    for (const l of LANGS)
      entries[l] = files(join(base, l)).map((f) => relative(join(base, l), f).replace(/\\/g, '/'));
    compare(`content/${c}`, entries);

    // Translations of the same entry share date, canonical URL, status, order, etc.
    for (const rel of entries.tr.filter((e) => /\.mdx?$/.test(e) && entries.en.includes(e))) {
      const [a, b] = LANGS.map((l) => frontmatter(join(base, l, rel)));
      for (const k of SHARED)
        if ((a[k] ?? '') !== (b[k] ?? ''))
          problems.push(`content/${c}/${rel}: "${k}" differs (tr "${a[k] ?? ''}" vs en "${b[k] ?? ''}")`);
    }

    // Data collections stored as src/content/<c>/{tr,en}.json (e.g. resume): same file, same key structure.
    const data = Object.fromEntries(LANGS.map((l) => [l, join(base, `${l}.json`)]));
    if (LANGS.some((l) => existsSync(data[l]))) {
      const keys = {};
      for (const l of LANGS) {
        if (!existsSync(data[l])) problems.push(`content/${c}: ${l}.json not found`);
        keys[l] = existsSync(data[l]) ? flatKeys(JSON.parse(readFileSync(data[l], 'utf8'))) : [];
      }
      compare(`content/${c} key`, keys);
    }
  }
}

problems.forEach((p) => console.log(`FAIL ${p}`));
console.log(`i18n-parity: ${problems.length ? `${problems.length} problems` : 'all passed'}`);
process.exit(problems.length ? 1 : 0);
