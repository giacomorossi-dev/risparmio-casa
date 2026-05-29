#!/usr/bin/env bun
/* biome-ignore-all lint/suspicious/noConsole: dev tool output */

import { spawnSync } from 'node:child_process';
import { createDb, users } from '@rc/db';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL non impostato. Crea .env da .env.example.');
  process.exit(1);
}

console.log('→ Eseguo drizzle-kit migrate su', databaseUrl);
const migrate = spawnSync('bun', ['run', 'db:migrate'], {
  stdio: 'inherit',
  cwd: 'packages/db',
  env: { ...process.env },
});
if (migrate.status !== 0) process.exit(migrate.status ?? 1);

console.log('→ Seed utente test (idempotente)');
const db = createDb(databaseUrl);
await db
  .insert(users)
  .values({ clerkId: 'user_offline_dev', email: 'dev@risparmiocasa.app' })
  .onConflictDoNothing();

console.log('✔  Dev bootstrap completato.');
console.log('   App     → http://localhost:3000');
console.log('   API     → http://localhost:3001');
console.log('   MailHog → http://localhost:8025');
