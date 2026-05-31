import { type CategoryDefinition, getCategoryBaseLabel } from './pricing';

const SITE_NAME = 'Quale Conviene';
const SITE_BRAND = 'Risparmio Casa';

/**
 * Public canonical URL of the deployment. Set `VITE_SITE_URL` at build time
 * (e.g. in Cloudflare Pages env vars). Falls back to a placeholder for
 * local dev so meta tags are still well-formed.
 */
const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://risparmiocasa.app';

// La sotto-app vive sotto /quale-conviene nell'aggregatore.
const QC_BASE = `${SITE_URL}/quale-conviene`;

const OG_IMAGE_URL = `${SITE_URL}/og-image.svg`;
const OG_IMAGE_META = [
  { property: 'og:image', content: OG_IMAGE_URL },
  { property: 'og:image:width', content: '1200' },
  { property: 'og:image:height', content: '630' },
  { property: 'og:image:alt', content: `${SITE_NAME} — confronta prezzi e formati` },
  { name: 'twitter:image', content: OG_IMAGE_URL },
];

export function buildCategoryMeta(category: CategoryDefinition) {
  // SEO-tuned title: long-tail + question framing performs better in SERP.
  const title = `${category.name} al miglior prezzo · €/${getCategoryBaseLabel(category)} · ${SITE_NAME} · ${SITE_BRAND}`;
  const description = category.description;
  const url = `${QC_BASE}/${category.slug}`;
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: SITE_BRAND },
    { property: 'og:locale', content: 'it_IT' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ...OG_IMAGE_META,
  ];
}

/**
 * Canonical link tag(s) for a route. Use `path` starting with "/" (e.g. "/terms")
 * or "/" for the home page. TanStack Router renders these as `<link>` elements
 * — `rel="canonical"` belongs on a `<link>`, not a `<meta>`.
 */
export function buildCanonicalLinks(path: string) {
  const href = path === '/' ? SITE_URL : `${SITE_URL}${path}`;
  return [{ rel: 'canonical', href }];
}

/**
 * Article schema for the category page (richer than plain WebApplication for
 * SERP) plus a BreadcrumbList for the site hierarchy. Returns an array so the
 * route can serialize each as a separate `<script type="application/ld+json">`.
 */
export function buildCategoryJsonLd(category: CategoryDefinition) {
  const url = `${QC_BASE}/${category.slug}`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${category.name} — quale conviene? Calcolatore €/${getCategoryBaseLabel(category)}`,
    description: category.description,
    url,
    inLanguage: 'it',
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: url,
  };
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category.name,
        item: url,
      },
    ],
  };
  const items: object[] = [article, breadcrumb];
  if (category.faq && category.faq.length > 0) {
    items.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: category.faq.map((qa) => ({
        '@type': 'Question',
        name: qa.q,
        acceptedAnswer: { '@type': 'Answer', text: qa.a },
      })),
    });
  }
  return items;
}

export function buildHomeMeta() {
  const title = `${SITE_NAME} · ${SITE_BRAND} — Confronta prezzi e formati`;
  const description =
    "Utility gratuite per scoprire quale prodotto conviene di più: confronta carta igienica, acqua, pasta e altre categorie normalizzando il prezzo all'unità.";
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: QC_BASE },
    { property: 'og:site_name', content: SITE_BRAND },
    { property: 'og:locale', content: 'it_IT' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    ...OG_IMAGE_META,
  ];
}

export { QC_BASE, SITE_NAME, SITE_URL };
