import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/Header';
import InteractiveScrollToTop from '@/components/InteractiveScrollToTop';
import {
  type ClusterPage,
  isForthcoming,
  labelForHref,
  sectionSteps,
} from '@/lib/cluster';

const linkClass =
  'inline-flex items-center justify-center rounded-2xl px-6 py-3 font-semibold transition-colors duration-300';

function SectionBody({ body }: { body: string }) {
  const steps = sectionSteps(body);

  if (steps) {
    return (
      <>
        {steps.lead ? (
          <p className="text-white/80 leading-relaxed mb-4">{steps.lead}</p>
        ) : null}
        <ol className="list-decimal space-y-3 pl-5 text-white/80 leading-relaxed marker:text-yellow-400">
          {steps.items.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </>
    );
  }

  return <p className="text-white/80 leading-relaxed">{body}</p>;
}

function SectionTable({ table }: { table: { columns: string[]; rows: string[][] } }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-white/20 bg-white/5">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-white/10">
            {table.columns.map((col, i) => (
              <th key={i} scope="col" className="px-4 py-3 font-semibold text-white">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, r) => (
            <tr key={r} className="border-t border-white/10 align-top">
              {row.map((cell, c) => (
                <td
                  key={c}
                  className={`px-4 py-3 ${c === 0 ? 'font-medium text-white' : 'text-white/75'}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Renders a Cluster A page from the JSON content file.
 *
 * FAQ is markup rather than a client accordion so it is in the HTML Google
 * receives, and matches the FAQPage JSON-LD emitted below.
 */
export default async function ClusterArticle({
  page,
  locale,
}: {
  page: ClusterPage;
  locale: string;
}) {
  const t = await getTranslations();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="relative text-white min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <article className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">{page.h1}</h1>
          <p className="text-lg text-white/80 leading-relaxed mb-4">{page.intro}</p>

          <div className="mt-16">
            {page.sections.map((section, i) => (
              <section key={i} className="mt-14 first:mt-0">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                  {section.h2}
                </h2>
                <SectionBody body={section.body} />
                {section.table ? <SectionTable table={section.table} /> : null}
              </section>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/contact`}
              className={`${linkClass} bg-yellow-400 text-black hover:bg-yellow-300`}
            >
              {page.cta_primary}
            </Link>
            <Link
              href={`/${locale}/services`}
              className={`${linkClass} border border-white/20 bg-white/5 hover:border-yellow-400/50`}
            >
              {page.cta_secondary}
            </Link>
          </div>

          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Related pages</h2>
            <ul className="space-y-3 text-white/80">
              {page.internal_links.map((href) => {
                const label = labelForHref(href);

                // Links to Cluster B/C/D, which are not built yet. Publishing a
                // link to a 404 is worse than publishing the label alone.
                if (isForthcoming(href)) {
                  return (
                    <li key={href} className="text-white/50">
                      {label}{' '}
                      <span className="text-xs uppercase tracking-wide text-white/35">
                        coming soon
                      </span>
                    </li>
                  );
                }

                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-yellow-400 hover:decoration-yellow-400"
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          <section className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {page.faq.map((item, i) => (
                <details
                  key={i}
                  className="group rounded-2xl border border-white/20 bg-white/5 backdrop-blur-lg open:border-yellow-400 open:bg-white/10"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-6 font-semibold text-lg [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span className="flex-shrink-0 text-yellow-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="px-6 pb-6 text-white/80 leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>
      </article>

      <footer className="py-8">
        <div className="container mx-auto px-4 text-center">
          <p>{t('Footer.copyright2023')}</p>
        </div>
      </footer>

      <InteractiveScrollToTop />
    </div>
  );
}
