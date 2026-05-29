import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

process.env.NODE_ENV = 'production';

const { createApp } = await import('../src/app.ts');

const app = createApp();
const res = await app.request('/api/openapi.json');
const json = await res.json();
const out = resolve(import.meta.dirname, '..', 'openapi.json');
writeFileSync(out, JSON.stringify(json, null, 2));
// biome-ignore lint/suspicious/noConsole: dev tool output
console.log(`OpenAPI schema scritto in ${out}`);
