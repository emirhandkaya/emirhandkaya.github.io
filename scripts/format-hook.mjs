// PostToolUse hook: run prettier on the edited file (quietly; never blocks).
import { spawnSync } from 'node:child_process';

let input = '';
process.stdin.on('data', (d) => (input += d));
process.stdin.on('end', () => {
  try {
    const file = JSON.parse(input)?.tool_input?.file_path;
    if (file && /\.(astro|ts|mjs|js|css|json|md|mdx)$/i.test(file) && !/node_modules|[\\/]dist[\\/]/.test(file)) {
      spawnSync('npx', ['prettier', '--write', '--log-level', 'silent', file], { shell: true, stdio: 'ignore' });
    }
  } catch {}
  process.exit(0);
});
