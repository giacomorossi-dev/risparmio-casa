import { serve } from '@hono/node-server';
import { createApp } from './app.ts';

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: createApp().fetch, port }, ({ port }) => {
  // biome-ignore lint/suspicious/noConsole: dev bootstrap output
  console.log(`API in ascolto su http://localhost:${port}`);
});
