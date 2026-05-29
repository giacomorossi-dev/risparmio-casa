import { OpenAPIHono } from '@hono/zod-openapi';
import { type AuthContext, clerkAuth } from '@rc/auth/server';
import { createLogger, type Logger } from '@rc/config/pino';
import { HTTPException } from 'hono/http-exception';
import { requestId } from 'hono/request-id';

import { meRouter } from './modules/me/router.ts';

type AppContext = AuthContext & {
  Variables: AuthContext['Variables'] & {
    logger: Logger;
    requestId: string;
  };
};

const log = createLogger({ service: 'api' });

export const createApp = () => {
  const app = new OpenAPIHono<AppContext>();

  app.use('*', requestId());

  app.use('*', async (c, next) => {
    const id = c.get('requestId');
    c.set('logger', log.child({ requestId: id, route: c.req.path }));
    return next();
  });

  app.onError((err, c) => {
    const logger = c.get('logger') ?? log;
    if (err instanceof HTTPException) {
      logger.warn({ status: err.status, msg: err.message }, 'http error');
      return c.json({ code: err.status, message: err.message }, err.status);
    }
    logger.error({ err }, 'unhandled error');
    return c.json({ code: 500, message: 'Errore interno del server' }, 500);
  });

  app.notFound((c) => c.json({ code: 404, message: 'Risorsa non trovata' }, 404));

  app.get('/api/health', (c) => c.json({ ok: true, stage: process.env.SST_STAGE ?? 'local' }));

  app.use('/api/me/*', clerkAuth());
  app.route('/api/me', meRouter());

  app.doc('/api/openapi.json', {
    openapi: '3.1.0',
    info: { title: 'risparmiocasa API', version: '0.0.0' },
  });

  return app;
};
