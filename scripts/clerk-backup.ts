#!/usr/bin/env bun
/**
 * Esporta lista utenti Clerk in JSON. Caricabile poi su S3 dal workflow.
 * Usage: CLERK_SECRET_KEY=... bun run scripts/clerk-backup.ts > clerk-users.json
 */
import { createClerkClient } from '@clerk/backend';

const secretKey = process.env.CLERK_SECRET_KEY;
if (!secretKey) {
  console.error('CLERK_SECRET_KEY non impostato.');
  process.exit(1);
}

const clerk = createClerkClient({ secretKey });
const all: unknown[] = [];
let offset = 0;
const limit = 100;

while (true) {
  const page = await clerk.users.getUserList({ limit, offset });
  all.push(
    ...page.data.map((u) => ({
      id: u.id,
      email: u.primaryEmailAddress?.emailAddress,
      createdAt: u.createdAt,
      lastSignInAt: u.lastSignInAt,
    })),
  );
  if (page.data.length < limit) break;
  offset += limit;
}

process.stdout.write(JSON.stringify(all, null, 2));
