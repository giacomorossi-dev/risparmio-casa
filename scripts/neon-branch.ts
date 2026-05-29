#!/usr/bin/env bun
/**
 * Gestione branch Neon Postgres per stage CI/CD.
 * Usage: bun run scripts/neon-branch.ts <create|delete> <branch-name>
 */

/* biome-ignore-all lint/suspicious/noConsole: dev tool output */

const [, , action, branchName] = process.argv;

if (!action || !branchName) {
  console.error('Usage: neon-branch.ts <create|delete> <branch-name>');
  process.exit(1);
}

const apiKey = process.env.NEON_API_KEY;
const projectId = process.env.NEON_PROJECT_ID;
if (!apiKey || !projectId) {
  console.error('NEON_API_KEY e NEON_PROJECT_ID devono essere impostati.');
  process.exit(1);
}

const base = `https://console.neon.tech/api/v2/projects/${projectId}`;
const headers = {
  Authorization: `Bearer ${apiKey}`,
  'content-type': 'application/json',
};

if (action === 'create') {
  const res = await fetch(`${base}/branches`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      branch: { name: branchName },
      endpoints: [{ type: 'read_write' }],
    }),
  });
  if (!res.ok) {
    console.error(await res.text());
    process.exit(1);
  }
  const data = (await res.json()) as {
    branch: { id: string };
    connection_uris?: Array<{ connection_uri: string }>;
  };
  const uri = data.connection_uris?.[0]?.connection_uri;
  if (uri) {
    console.log(`DATABASE_URL=${uri}`);
  }
} else if (action === 'delete') {
  const list = (await fetch(`${base}/branches`, { headers }).then((r) => r.json())) as {
    branches: Array<{ id: string; name: string }>;
  };
  const target = list.branches.find((b) => b.name === branchName);
  if (!target) {
    console.log(`Branch ${branchName} non trovato, niente da fare.`);
    process.exit(0);
  }
  const res = await fetch(`${base}/branches/${target.id}`, { method: 'DELETE', headers });
  if (!res.ok) {
    console.error(await res.text());
    process.exit(1);
  }
  console.log(`Branch ${branchName} eliminato.`);
} else {
  console.error(`Azione non riconosciuta: ${action}`);
  process.exit(1);
}
