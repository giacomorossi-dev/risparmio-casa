import { router } from './router.ts';
import { secrets } from './secrets.ts';

const isProd = $app.stage === 'production';

const tracing = { function: { tracingConfig: { mode: 'Active' } } } as const;

export const api = new sst.aws.Function('Api', {
  handler: 'services/api/src/index.handler',
  runtime: 'nodejs22.x',
  architecture: 'arm64',
  memory: '512 MB',
  timeout: '15 seconds',
  transform: tracing,
  link: [
    secrets.clerkSecretKey,
    secrets.clerkPublishableKey,
    secrets.databaseUrl,
    secrets.sentryDsn,
  ],
  environment: {
    SST_STAGE: $app.stage,
    NODE_ENV: isProd ? 'production' : 'development',
  },
  url: {
    router: { instance: router, path: '/api' },
  },
});

export const webhookClerk = new sst.aws.Function('WebhookClerk', {
  handler: 'services/webhook-clerk/src/index.handler',
  runtime: 'nodejs22.x',
  architecture: 'arm64',
  memory: '256 MB',
  timeout: '10 seconds',
  transform: tracing,
  link: [secrets.clerkWebhookSecret, secrets.databaseUrl, secrets.sentryDsn],
  environment: {
    SST_STAGE: $app.stage,
    NODE_ENV: isProd ? 'production' : 'development',
  },
  url: {
    router: { instance: router, path: '/webhooks/clerk' },
  },
});
