import { expect, test } from '@playwright/test';

// Smoke e2e dell'app Utilità (gira key-less contro il build SSR): landing,
// ricerca, pin con persistenza e pagina di un tool (componente lazy che calcola).

test.describe('utilità', () => {
  test('landing: card e ricerca per keyword', async ({ page }) => {
    await page.goto('/utilita');
    await expect(page).toHaveTitle(/Utilità/);
    await expect(page.locator('a[href="/utilita/convertitore-unita"]')).toBeVisible();

    await page.getByRole('searchbox').fill('forno');
    await expect(page.locator('a[href="/utilita/forno"]')).toBeVisible();
    await expect(page.locator('a[href="/utilita/convertitore-unita"]')).toHaveCount(0);
  });

  test('pin: aggiunge ai preferiti e persiste in localStorage', async ({ page }) => {
    await page.goto('/utilita');
    const card = page.locator('a[href="/utilita/sconto"]').locator('..');
    await card.getByRole('button', { name: /preferiti/i }).click();

    await expect(page.getByRole('heading', { name: 'Preferite' })).toBeVisible();
    const stored = await page.evaluate(() => localStorage.getItem('utilita:pinned'));
    expect(stored).toContain('sconto');
  });

  test('pagina tool: il componente lazy si carica e calcola', async ({ page }) => {
    // flusso reale: dalla landing si clicca la card (client-nav, niente race SSR)
    await page.goto('/utilita');
    await page.locator('a[href="/utilita/sconto"]').click();
    await expect(page.getByRole('heading', { level: 1, name: 'Sconto' })).toBeVisible();

    await page.getByLabel('Prezzo (€)').fill('100');
    await page.getByLabel('Sconto (%)').fill('30');
    await expect(page.getByText(/70,00\s*€/)).toBeVisible();
  });

  test('slug sconosciuto → 404', async ({ page }) => {
    const res = await page.goto('/utilita/non-esiste');
    expect(res?.status()).toBe(404);
  });
});
