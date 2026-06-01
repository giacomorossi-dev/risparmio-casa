import { createFileRoute, getRouteApi, Link, notFound } from '@tanstack/react-router';
import { BookOpen, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import CategoryCard from '../../features/quale-conviene/components/CategoryCard.tsx';
import CategoryPager from '../../features/quale-conviene/components/CategoryPager.tsx';
import Comparator from '../../features/quale-conviene/components/Comparator.tsx';
import SectionIcon from '../../features/quale-conviene/components/SectionIcon.tsx';
import {
  getAdjacentCategories,
  getCategoryBySlug,
  getRelatedCategories,
} from '../../features/quale-conviene/data/categories.ts';
import { getCategoryContent } from '../../features/quale-conviene/data/category-content.ts';
import {
  buildCanonicalLinks,
  buildCategoryJsonLd,
  buildCategoryMeta,
  buildFaqJsonLd,
} from '../../features/quale-conviene/lib/seo.ts';

export const Route = createFileRoute('/quale-conviene/$category')({
  loader: ({ params }) => {
    const category = getCategoryBySlug(params.category);
    if (!category) throw notFound();
    return category;
  },
  // `head` resta eager (chunk principale): solo Article + BreadcrumbList, niente
  // dati pesanti. Il FAQPage JSON-LD è emesso dal componente (chunk lazy) perché
  // dipende dal copy in `category-content.ts`, che non deve finire nella landing.
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: buildCategoryMeta(loaderData),
      links: buildCanonicalLinks(`/quale-conviene/${loaderData.slug}`),
      scripts: buildCategoryJsonLd(loaderData).map((item) => ({
        type: 'application/ld+json',
        children: JSON.stringify(item),
      })),
    };
  },
  component: CategoryPage,
});

const route = getRouteApi('/quale-conviene/$category');

function CategoryPage() {
  const category = route.useLoaderData();
  const content = getCategoryContent(category.slug);
  const faqJsonLd = buildFaqJsonLd(content.faq);
  const related = getRelatedCategories(category);
  const { prev, next } = getAdjacentCategories(category);

  return (
    <div className="space-y-10">
      <nav
        aria-label="breadcrumb"
        className="flex items-center gap-1 text-sm text-muted-foreground"
      >
        <Link to="/quale-conviene" className="hover:underline hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      <article className="space-y-3">
        <h1 className=" text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.1]">
          <span className="text-primary">{category.name}</span>
        </h1>
        <p className="text-lg text-muted-foreground">{category.description}</p>
        {content.intro && <p className="text-base text-muted-foreground">{content.intro}</p>}
      </article>

      <Comparator category={category} />

      {(content.longDescription || (content.sections && content.sections.length > 0)) && (
        <section>
          <h2 className="flex items-center gap-3 text-xl font-semibold">
            <SectionIcon>
              <BookOpen />
            </SectionIcon>
            {content.guideTitle ?? 'Guida ai prezzi'}
          </h2>
          <div aria-hidden="true" className="bg-primary mt-2 mb-4 h-[2px] w-full" />
          {content.longDescription && (
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              {content.longDescription.split(/\n\s*\n/).map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
          )}
          {content.sections?.map((s) => (
            <div key={s.heading} className="mt-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">{s.heading}</h3>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                {s.body.split(/\n\s*\n/).map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {faqJsonLd && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializzato da noi (nessun input utente)
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {content.faq && content.faq.length > 0 && (
        <section>
          <h2 className="flex items-center gap-3 text-xl font-semibold">
            <SectionIcon>
              <HelpCircle />
            </SectionIcon>
            Domande frequenti
          </h2>
          <div aria-hidden="true" className="bg-primary mt-2 mb-4 h-[2px] w-full" />
          <dl className="space-y-4">
            {content.faq.map((qa) => (
              <div key={qa.q} className="rounded-lg border bg-card p-4">
                <dt className="font-semibold mb-2">{qa.q}</dt>
                <dd className="text-muted-foreground leading-relaxed">{qa.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {related.length > 0 && (
        <section>
          <h2 className="flex items-center gap-3 text-xl font-semibold">
            <SectionIcon>
              <Sparkles />
            </SectionIcon>
            Categorie correlate
          </h2>
          <div aria-hidden="true" className="bg-primary mt-2 mb-4 h-[2px] w-full" />
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </section>
      )}

      <CategoryPager prev={prev} next={next} />
    </div>
  );
}
