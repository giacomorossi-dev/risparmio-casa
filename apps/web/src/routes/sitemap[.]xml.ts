import { createFileRoute } from '@tanstack/react-router';

import { APPS } from '../apps.ts';
import { CATEGORIES } from '../features/quale-conviene/data/categories.ts';
import { SITE_URL } from '../features/quale-conviene/lib/seo.ts';

type Entry = { loc: string; priority: string };

function buildSitemap(): string {
  const today = new Date().toISOString().slice(0, 10);
  const staticPaths = [
    '/',
    ...APPS.map((a) => a.path),
    '/contatti',
    '/privacy',
    '/termini',
    '/cookie',
  ];
  const entries: Entry[] = [
    ...staticPaths.map((p) => ({
      loc: p === '/' ? SITE_URL : `${SITE_URL}${p}`,
      priority: p === '/' ? '1.0' : '0.7',
    })),
    // pagine categoria di quale-conviene
    ...CATEGORIES.map((c) => ({
      loc: `${SITE_URL}/quale-conviene/${c.slug}`,
      priority: '0.8',
    })),
  ];
  const body = entries
    .map(
      (u) =>
        `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(buildSitemap(), {
          headers: {
            'content-type': 'application/xml; charset=utf-8',
            'cache-control': 'public, max-age=3600',
          },
        }),
    },
  },
});
