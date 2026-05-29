#!/usr/bin/env bun
/**
 * Drill mensile: crea branch Neon da production, esegue smoke check, elimina.
 * Usage: NEON_API_KEY=... NEON_PROJECT_ID=... bun run scripts/backup-dry-run.ts
 */

/* biome-ignore-all lint/suspicious/noConsole: dev tool output */

import { spawnSync } from 'node:child_process';

const branchName = `restore-drill-${new Date().toISOString().slice(0, 10)}`;

console.log(`→ Creo branch ${branchName} da production`);
const create = spawnSync('bun', ['run', 'scripts/neon-branch.ts', 'create', branchName], {
  stdio: 'inherit',
});
if (create.status !== 0) process.exit(create.status ?? 1);

console.log('→ TODO: connetti al branch e verifica conteggio righe attese');
console.log('→ TODO: confronta con baseline (es. SELECT count(*) FROM users)');

console.log(`→ Elimino branch ${branchName}`);
const del = spawnSync('bun', ['run', 'scripts/neon-branch.ts', 'delete', branchName], {
  stdio: 'inherit',
});
process.exit(del.status ?? 0);
