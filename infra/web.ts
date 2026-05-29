import { api } from './api.ts';
import { router } from './router.ts';
import { secrets } from './secrets.ts';

export const web = new sst.aws.TanStackStart('Web', {
  path: 'apps/web',
  link: [secrets.clerkPublishableKey, secrets.sentryDsn, api],
  environment: {
    SST_STAGE: $app.stage,
  },
  router: {
    instance: router,
    path: '/',
  },
});
