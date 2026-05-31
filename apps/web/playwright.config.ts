import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

// Le route /quale-conviene sono pubbliche e l'app rende anche senza Clerk
// (clerkEnabled=false quando manca la publishable key — vedi src/lib/clerk.ts),
// quindi l'e2e gira contro un build key-less: nessun secret necessario.
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
    env: { PORT: String(PORT) },
  },
});
