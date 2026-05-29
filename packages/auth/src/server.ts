import { createClerkClient, verifyToken } from '@clerk/backend';
import type { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';

export type AuthContext = {
  Variables: {
    userId: string;
    sessionId: string;
  };
};

type ClerkAuthOptions = {
  secretKey?: string | undefined;
  publishableKey?: string | undefined;
  offline?: boolean | undefined;
};

const OFFLINE_STUB_USER = 'user_offline_dev';
const OFFLINE_STUB_SESSION = 'sess_offline_dev';

const extractBearerToken = (c: Context): string => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;

  if (!token) {
    throw new HTTPException(401, { message: 'Token mancante' });
  }

  return token;
};

const verifySession = async (token: string, secretKey: string) => {
  try {
    const payload = await verifyToken(token, { secretKey });

    if (!payload.sub || !payload.sid) {
      throw new HTTPException(401, { message: 'Token non valido' });
    }

    return { userId: payload.sub, sessionId: payload.sid as string };
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    throw new HTTPException(401, { message: 'Sessione scaduta o non valida' });
  }
};

export const clerkAuth = (options: ClerkAuthOptions = {}) =>
  createMiddleware<AuthContext>(async (c, next) => {
    const offline = options.offline ?? process.env.OFFLINE_AUTH === '1';

    if (offline) {
      c.set('userId', OFFLINE_STUB_USER);
      c.set('sessionId', OFFLINE_STUB_SESSION);
      return next();
    }

    const secretKey = options.secretKey ?? process.env.CLERK_SECRET_KEY;
    if (!secretKey) {
      throw new HTTPException(500, { message: 'Auth non configurato' });
    }

    const token = extractBearerToken(c);
    const { userId, sessionId } = await verifySession(token, secretKey);
    c.set('userId', userId);
    c.set('sessionId', sessionId);

    return next();
  });

export const clerkServerClient = (secretKey?: string) => {
  const key = secretKey ?? process.env.CLERK_SECRET_KEY;
  if (!key) throw new Error('CLERK_SECRET_KEY non impostato');
  return createClerkClient({ secretKey: key });
};
