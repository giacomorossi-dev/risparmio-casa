import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from './schema.ts';

export type Database = ReturnType<typeof createDb>;

const isNeon = (url: string) => url.includes('neon.tech') || process.env.DATABASE_DRIVER === 'neon';

export const createDb = (databaseUrl: string) => {
  if (isNeon(databaseUrl)) {
    const sql = neon(databaseUrl);
    return drizzleNeon(sql, { schema, casing: 'snake_case' });
  }

  const pool = new Pool({ connectionString: databaseUrl, max: 1 });
  return drizzleNode(pool, { schema, casing: 'snake_case' });
};
