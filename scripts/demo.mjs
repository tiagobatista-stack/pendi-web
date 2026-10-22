// Executa a suíte com vídeo ligado (DEMO=1), sem depender de sintaxe de shell.
import { spawnSync } from 'node:child_process';
const r = spawnSync('npx', ['playwright', 'test'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, DEMO: '1' },
});
process.exit(r.status ?? 1);
