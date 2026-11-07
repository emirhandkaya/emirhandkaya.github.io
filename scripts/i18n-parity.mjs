// Fails if any UI key, page, or content entry exists in one language but not the other.
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

// 2. Pages: src/pages/{tr,en}/**
const pages = {};
for (const l of LANGS)
  pages[l] = files(`src/pages/${l}`).map((f) => relative(`src/pages/${l}`, f).replace(/\\/g, '/'));
compare('page', pages);

// 3. Content: src/content/<collection>/{tr,en}/** (translations share a slug)
if (existsSync('src/content')) {
  for (const c of readdirSync('src/content')) {
    const base = join('src/content', c);
    if (!statSync(base).isDirectory()) continue;
    const entries = {};
    for (const l of LANGS)
      entries[l] = files(join(base, l)).map((f) => relative(join(base, l), f).replace(/\\/g, '/'));
    compare(`content/${c}`, entries);

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
