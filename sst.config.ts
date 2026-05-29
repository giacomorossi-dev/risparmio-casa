/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'risparmiocasa',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: input?.stage === 'production',
      home: 'aws',
      providers: {
        aws: { region: 'eu-south-1' },
      },
    };
  },
  async run() {
    const { secrets } = await import('./infra/secrets.ts');
    const { router } = await import('./infra/router.ts');
    const { api, webhookClerk } = await import('./infra/api.ts');
    const { web } = await import('./infra/web.ts');
    const { guardrails } = await import('./infra/guardrails.ts');

    return {
      url: router.url,
      api: api.url,
      webhookClerk: webhookClerk.url,
      web: web.url,
      secrets: Object.keys(secrets),
      guardrailsBudget: guardrails.budgetName,
    };
  },
});
