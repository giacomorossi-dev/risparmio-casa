import { readFileSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// Le route /quale-conviene sono pubbliche, ma `clerkMiddleware` (src/start.ts)
// gira su ogni richiesta SSR e pretende chiavi Clerk valide per renderizzare
// (con chiavi finte Clerk risponde "Invalid host"). Quindi servono chiavi reali:
// - in locale le leggiamo dal .env del repo (istanza Clerk di sviluppo);
// - in CI arrivano da process.env (secret del repository).
function loadDotenv(path: string): Record<string, string> {
  try {
    const out: Record<string, string> = {};
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m?.[1]) out[m[1]] = (m[2] ?? '').replace(/^["']|["']$/g, '');
    }
    return out;
  } catch {
    return {};
  }
}

const dotenv = loadDotenv(new URL('../../.env', import.meta.url).pathname);
const pick = (key: string) => process.env[key] ?? dotenv[key] ?? '';
const CLERK_PUBLISHABLE_KEY = pick('CLERK_PUBLISHABLE_KEY');
const CLERK_SECRET_KEY = pick('CLERK_SECRET_KEY');

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Serve il build SSR di produzione (più rappresentativo di `vite dev`: copre
  // SSR + code-splitting). `turbo run test:e2e` fa girare prima `build`.
  webServer: {
    command: 'node .output/server/index.mjs',
    url: `${BASE_URL}/quale-conviene`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      PORT: String(PORT),
      CLERK_SECRET_KEY,
      CLERK_PUBLISHABLE_KEY,
      VITE_CLERK_PUBLISHABLE_KEY: pick('VITE_CLERK_PUBLISHABLE_KEY') || CLERK_PUBLISHABLE_KEY,
    },
  },
});
