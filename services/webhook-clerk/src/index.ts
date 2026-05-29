import { createLogger } from '@rc/config/pino';
import { createDb, users } from '@rc/db';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { eq } from 'drizzle-orm';
import { Webhook } from 'svix';

const log = createLogger({ service: 'webhook-clerk' });

type ClerkUserEvent = {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: {
    id: string;
    email_addresses?: Array<{ id: string; email_address: string }>;
    primary_email_address_id?: string | null;
  };
};

const json = (status: number, body: unknown): APIGatewayProxyResultV2 => ({
  statusCode: status,
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  const databaseUrl = process.env.DATABASE_URL;
  if (!secret || !databaseUrl) {
    log.error('CLERK_WEBHOOK_SECRET o DATABASE_URL non impostati');
    return json(500, { code: 500, message: 'Configurazione mancante' });
  }

  const body = event.body ?? '';
  const headers = {
    'svix-id': event.headers['svix-id'] ?? '',
    'svix-timestamp': event.headers['svix-timestamp'] ?? '',
    'svix-signature': event.headers['svix-signature'] ?? '',
  };

  let payload: ClerkUserEvent;
  try {
    const wh = new Webhook(secret);
    payload = wh.verify(body, headers) as ClerkUserEvent;
  } catch (err) {
    log.warn({ err }, 'firma webhook non valida');
    return json(401, { code: 401, message: 'Firma non valida' });
  }

  const db = createDb(databaseUrl);
  const clerkId = payload.data.id;

  if (payload.type === 'user.created' || payload.type === 'user.updated') {
    const primary = payload.data.email_addresses?.find(
      (e) => e.id === payload.data.primary_email_address_id,
    );
    const email = primary?.email_address;
    if (!email) {
      log.warn({ clerkId }, 'evento senza email primaria');
      return json(200, { ok: true, skipped: 'no-email' });
    }

    await db
      .insert(users)
      .values({ clerkId, email })
      .onConflictDoUpdate({
        target: users.clerkId,
        set: { email, updatedAt: new Date() },
      });

    log.info({ clerkId, type: payload.type }, 'utente sincronizzato');
  } else if (payload.type === 'user.deleted') {
    await db.delete(users).where(eq(users.clerkId, clerkId));
    log.info({ clerkId }, 'utente cancellato');
  }

  return json(200, { ok: true });
};
