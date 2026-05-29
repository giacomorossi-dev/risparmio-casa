const STAGE_DOMAINS: Record<string, string> = {
  production: 'risparmiocasa.app',
  staging: 'staging.risparmiocasa.app',
};

const domain = STAGE_DOMAINS[$app.stage] ?? `${$app.stage}.staging.risparmiocasa.app`;

export const router = new sst.aws.Router('Shell', {
  domain: {
    name: domain,
    dns: sst.aws.dns(),
  },
});
