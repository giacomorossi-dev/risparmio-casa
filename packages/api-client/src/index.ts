import createClient from 'openapi-fetch';

// Lo schema viene generato in build-time da `bun run generate` su services/api openapi.json.
// Placeholder: tipi vuoti finché il primo build dell'API non è stato eseguito.
type Paths = Record<string, never>;

type CreateApiClientArgs = {
  baseUrl: string;
  getToken?: () => Promise<string | null | undefined>;
};

export const createApiClient = ({ baseUrl, getToken }: CreateApiClientArgs) => {
  const client = createClient<Paths>({ baseUrl });

  if (getToken) {
    client.use({
      onRequest: async ({ request }) => {
        const token = await getToken();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
        return request;
      },
    });
  }

  return client;
};

export type ApiClient = ReturnType<typeof createApiClient>;
