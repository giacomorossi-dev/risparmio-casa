export const secrets = {
  clerkSecretKey: new sst.Secret('ClerkSecretKey'),
  clerkPublishableKey: new sst.Secret('ClerkPublishableKey'),
  clerkWebhookSecret: new sst.Secret('ClerkWebhookSecret'),
  databaseUrl: new sst.Secret('DatabaseUrl'),
  sentryDsn: new sst.Secret('SentryDsn', ''),
};
