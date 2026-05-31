import { expect, test } from '@playwright/test';
import { encodeEntries } from '../src/features/quale-conviene/lib/share.ts';

// Smoke e2e dei percorsi utente principali di /quale-conviene contro il build SSR.
// La matematica fine è coperta dai test golden (lib/*.test.ts): qui verifichiamo
// rendering, routing, ripristino da share e i meta/JSON-LD per la SEO.

test.describe('quale-conviene', () => {
  test('home: hero, griglia categorie e ricerca', async ({ page }) => {
    await page.goto('/quale-conviene');
    await expect(page).toHaveTitle(/Risparmio Casa/);

    const cards = page.locator('a[href^="/quale-conviene/"]');
    expect(await cards.count()).toBeGreaterThan(5);

    await page.getByRole('searchbox').fill('acqua');
    await expect(page.locator('a[href="/quale-conviene/acqua"]')).toBeVisible();
  });

  test('home: ricerca senza risultati mostra la CTA "confronto su misura"', async ({ page }) => {
    await page.goto('/quale-conviene');
    await page.getByRole('searchbox').fill('zzz-prodotto-inesistente');

    const cta = page.getByRole('button', { name: /Crea un confronto/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute('href', /\/quale-conviene\/confronta/);
  });

  test('categoria: comparatore, canonical e JSON-LD FAQPage', async ({ page }) => {
    await page.goto('/quale-conviene/acqua');
    await expect(page).toHaveTitle(/Acqua.*Risparmio Casa/);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://risparmiocasa.app/quale-conviene/acqua',
    );

    // Tabella risultati con almeno una riga (sample entries pre-caricate).
    expect(await page.locator('table tbody tr').count()).toBeGreaterThan(0);

    // Il FAQPage JSON-LD è emesso dal componente (chunk lazy), non dall'head.
    const jsonLd = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).join(' ');
    expect(jsonLd).toContain('FAQPage');

    await expect(page.getByRole('heading', { name: 'Domande frequenti' })).toBeVisible();
  });

  test('share: ?d= ripristina i prodotti condivisi', async ({ page }) => {
    const token = encodeEntries([
      {
        name: 'Acqua di prova',
        price: 4.49,
        counts: { box: 1, bottle: 6 },
        measureValue: 1.5,
        measureUnitId: 'L',
      },
    ]);
    await page.goto(`/quale-conviene/acqua?d=${token}`);

    await expect(page.getByText(/Comparazione condivisa caricata/i)).toBeVisible();
    await expect(page.getByLabel('Nome prodotto').first()).toHaveValue('Acqua di prova');
  });

  test('confronta: il wizard personalizzato è raggiungibile', async ({ page }) => {
    await page.goto('/quale-conviene/confronta');
    await expect(page.getByRole('heading', { name: 'Configura' })).toBeVisible();
  });
});
