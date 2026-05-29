import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi';
import type { AuthContext } from '@rc/auth/server';
import { createDb, users } from '@rc/db';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

const MeResponse = z
  .object({
    clerkId: z.string(),
    email: z.string().email(),
    plan: z.enum(['free', 'pro']),
  })
  .openapi('Me');

export const meRouter = () => {
  const router = new OpenAPIHono<AuthContext>();

  router.openapi(
    createRoute({
      method: 'get',
      path: '/',
      summary: 'Profilo utente corrente',
      responses: {
        200: {
          content: { 'application/json': { schema: MeResponse } },
          description: 'Profilo utente',
        },
        401: { description: 'Non autenticato' },
        404: { description: 'Utente non trovato' },
      },
    }),
    async (c) => {
      const clerkId = c.get('userId');
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) throw new HTTPException(500, { message: 'DB non configurato' });

      const db = createDb(databaseUrl);
      const row = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
      });

      if (!row) throw new HTTPException(404, { message: 'Utente non ancora sincronizzato' });

      return c.json({ clerkId: row.clerkId, email: row.email, plan: 'free' as const });
    },
  );

  return router;
};
