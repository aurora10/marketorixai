import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClusterArticle from '@/components/ClusterArticle';
import { CLUSTER_LOCALE, fixPath, getFixPage } from '@/lib/cluster';
import { singleLocaleAlternates } from '@/lib/site';

interface FixPageProps {
  params: { locale: string; slug: string };
}

export function generateMetadata({ params }: FixPageProps): Metadata {
  const page = getFixPage(params.slug);

  // The cluster is English-only, so /nl/fix/... genuinely does not exist.
  if (!page || params.locale !== CLUSTER_LOCALE) return {};

  const path = fixPath(page.slug);

  return {
    title: page.meta_title,
    description: page.meta_description,
    alternates: singleLocaleAlternates(CLUSTER_LOCALE, path),
    openGraph: {
      title: page.meta_title,
      description: page.meta_description,
      url: singleLocaleAlternates(CLUSTER_LOCALE, path).canonical,
      type: 'article',
    },
  };
}

export default function FixPage({ params }: FixPageProps) {
  if (params.locale !== CLUSTER_LOCALE) notFound();

  const page = getFixPage(params.slug);
  if (!page) notFound();

  return <ClusterArticle page={page} locale={CLUSTER_LOCALE} />;
}
