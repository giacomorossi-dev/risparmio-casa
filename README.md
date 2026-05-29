# risparmiocasa.app

Monorepo della piattaforma `risparmiocasa.app`. Single TanStack Start app + Hono API serverless su AWS Lambda, infra SST Ion, DB Neon Postgres, auth Clerk.

## Quick start

### Online dev (consigliato)
```bash
bun install
bun sst dev --stage dev-$USER
```

### Offline dev
```bash
bun install
docker compose up -d
bun run dev:bootstrap   # migrate + seed
bun dev
```

App → http://localhost:3000  •  API → http://localhost:3001  •  MailHog UI → http://localhost:8025

## Struttura

- `apps/web/` — single TanStack Start (home, sub-app routes, gated /app)
- `services/api/` — Hono monolite (Lambda Node 22 arm64)
- `services/webhook-clerk/` — Lambda dedicata webhook Clerk
- `packages/` — `ui`, `auth`, `db`, `i18n`, `api-client`, `config`
- `infra/` — moduli SST (Router, Web, Api, Secrets, Observability, Guardrails)
- `scripts/` — bun script (dev-bootstrap, backup-dry-run, clerk-backup)

## Stage

| Stage | Trigger | URL |
|---|---|---|
| staging | push `main` | https://staging.risparmiocasa.app |
| production | tag `v*` + approvazione manuale | https://risparmiocasa.app |
| pr-N | apertura PR | https://pr-N.staging.risparmiocasa.app |
| dev-USER | `bun sst dev --stage dev-$USER` | url temporaneo SST |

## Comandi

```bash
bun run dev            # turbo dev --parallel (apps + services)
bun run build          # turbo build
bun run lint           # biome check
bun run typecheck      # turbo typecheck
bun run test           # vitest tutti i package
bun sst deploy --stage staging
```

Tutta l'infra è dichiarata in `sst.config.ts` e `infra/*`. Niente self-hosted: AWS managed + Clerk + Neon + Sentry sono tutti SaaS.

Piano completo: `/home/giacomo/.claude/plans/dobbiamo-creare-un-app-melodic-stardust.md`.
