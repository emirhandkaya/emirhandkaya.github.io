// Usage: node scripts/report.mjs <name> "<cmd 1>" ["<cmd 2>" ...]
// Runs each command, writes full output to reports/<name>.txt,
// prints only a summary plus failure lines. Exits non-zero if any command fails.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';

const [name, ...cmds] = process.argv.slice(2);
if (!name || cmds.length === 0) {
  console.error('usage: report.mjs <name> "<cmd>" ...');
  process.exit(2);
}
const FAIL = /(error|fail|✖|broken|\[[45]\d\d\]|not found|missing)/i;
const IGNORE = /(0 errors|0 failed|errors: 0|0 broken)/i;

mkdirSync('reports', { recursive: true });
let log = '';
let failed = 0;
const summary = [];
for (const cmd of cmds) {
  const r = spawnSync(cmd, { shell: true, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  log += `$ ${cmd}\n${out}\n[exit ${r.status}]\n\n`;
  const bad = out.split(/\r?\n/).filter((l) => FAIL.test(l) && !IGNORE.test(l));
  if (r.status !== 0) failed++;
  summary.push({ cmd, status: r.status, bad });
}
writeFileSync(`reports/${name}.txt`, log);
for (const s of summary) {
  console.log(`${s.status === 0 ? 'PASS' : 'FAIL'}  ${s.cmd}`);
  if (s.status !== 0) s.bad.slice(0, 40).forEach((l) => console.log(`  ${l.trim()}`));
}
console.log(`${name}: ${failed ? `${failed} failing` : 'all passed'} (full log: reports/${name}.txt)`);
process.exit(failed ? 1 : 0);
