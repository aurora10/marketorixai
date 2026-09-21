import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClusterArticle from '@/components/ClusterArticle';
import { CLUSTER_LOCALE, HUB_PAGE, clusterPath } from '@/lib/cluster';
import { singleLocaleAlternates } from '@/lib/site';

interface HubPageProps {
  params: { locale: string };
}

export function generateMetadata({ params }: HubPageProps): Metadata {
  if (!HUB_PAGE || params.locale !== CLUSTER_LOCALE) return {};

  const alternates = singleLocaleAlternates(CLUSTER_LOCALE, clusterPath(HUB_PAGE.slug));

  return {
    title: HUB_PAGE.meta_title,
    description: HUB_PAGE.meta_description,
    alternates,
    openGraph: {
      title: HUB_PAGE.meta_title,
      description: HUB_PAGE.meta_description,
      url: alternates.canonical,
      type: 'article',
    },
  };
}

export default function CaseStudiesPage({ params }: HubPageProps) {
  if (!HUB_PAGE || params.locale !== CLUSTER_LOCALE) notFound();

  return <ClusterArticle page={HUB_PAGE} locale={CLUSTER_LOCALE} />;
}
