import raw from '@/content/cluster-a.json';

export interface ClusterTable {
  columns: string[];
  rows: string[][];
}

export interface ClusterSection {
  h2: string;
  body: string;
  format: string;
  table?: ClusterTable;
}

export interface ClusterFaqItem {
  q: string;
  a: string;
}

export interface ClusterPage {
  slug: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  intro: string;
  sections: ClusterSection[];
  faq: ClusterFaqItem[];
  cta_primary: string;
  cta_secondary: string;
  internal_links: string[];
}

export interface ClusterContent {
  cluster: string;
  locale: string;
  url_pattern: string;
  version?: string;
  content_policy?: Record<string, string>;
  forthcoming_paths?: string[];
  pages: ClusterPage[];
}

/**
 * The cluster is authored as JSON and imported statically, so the bundler
 * inlines it into the build. That matters because the app ships with
 * `output: 'standalone'` — reading it from disk at runtime would need the file
 * traced into the image, whereas a static import cannot go missing in
 * production.
 *
 * The cast is necessary: TypeScript infers a union where only some sections
 * carry `table`, which makes `section.table` unsafe to read.
 */
export const clusterContent = raw as unknown as ClusterContent;

/** Cluster A is English-only; there is no nl translation to advertise. */
export const CLUSTER_LOCALE = clusterContent.locale;

export const HUB_SLUG = 'case-studies';

export const CLUSTER_PAGES: ClusterPage[] = clusterContent.pages;

export const FIX_PAGES: ClusterPage[] = CLUSTER_PAGES.filter((p) => p.slug !== HUB_SLUG);

export const HUB_PAGE: ClusterPage | undefined = CLUSTER_PAGES.find((p) => p.slug === HUB_SLUG);

/**
 * Paths that are linked from the cluster but do not exist yet (the future
 * Cluster B/C/D pages). Declared in the data so the renderer can show them as
 * text instead of publishing broken links, and so there is one place to edit
 * when those pages ship.
 */
export const FORTHCOMING_PATHS: ReadonlySet<string> = new Set(
  clusterContent.forthcoming_paths ?? []
);

/** Locale-relative path for a cluster page: the hub sits at /case-studies, fix pages under /fix/. */
export function clusterPath(slug: string): string {
  return slug === HUB_SLUG ? `/${slug}` : `/fix/${slug}`;
}

/** Locale-relative path for a fix page slug (no leading locale). */
export function fixPath(slug: string): string {
  return `/fix/${slug}`;
}

export function getFixPage(slug: string): ClusterPage | undefined {
  return FIX_PAGES.find((p) => p.slug === slug);
}

export function isForthcoming(href: string): boolean {
  return FORTHCOMING_PATHS.has(href);
}

/** Human-readable label for an internal link, since the data stores URLs only. */
const ACRONYMS: Record<string, string> = {
  ai: 'AI',
  roi: 'ROI',
  gdpr: 'GDPR',
  erp: 'ERP',
  poc: 'POC',
  crm: 'CRM',
  api: 'API',
  tco: 'TCO',
  sme: 'SME',
};

export function labelForHref(href: string): string {
  const segment = href.split('/').filter(Boolean).pop() ?? href;
  const words = segment.split('-').map((w) => ACRONYMS[w] ?? w);
  const label = words.join(' ');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/**
 * Bodies that contain a numbered run are lists in disguise; the source keeps
 * them as one string, sometimes behind a lead-in sentence.
 *
 * Markers must run 1, 2, 3, ... consecutively, which is what keeps decimals
 * ("2.5 weeks") and years from being mistaken for list items.
 */
const STEP_MARKER = /(?:^|\s)(Step\s+\d+[:.]|\d+[.)])\s+/gi;

export interface SectionSteps {
  lead?: string;
  items: string[];
}

export function sectionSteps(body: string): SectionSteps | null {
  const text = body.trim();
  const matches = [...text.matchAll(STEP_MARKER)];
  if (matches.length < 2) return null;

  const numbers = matches.map((m) =>
    Number(String(m[1]).replace(/[^\d]/g, ''))
  );

  if (numbers[0] !== 1) return null;
  for (let i = 1; i < numbers.length; i += 1) {
    if (numbers[i] !== numbers[i - 1] + 1) return null;
  }

  const lead = text.slice(0, matches[0].index ?? 0).trim();

  const items = matches
    .map((m, i) => {
      const start = (m.index ?? 0) + m[0].length;
      // Text after the final item belongs to it; the source gives no marker to
      // separate a closing sentence, so it stays attached rather than being lost.
      const end = i + 1 < matches.length ? matches[i + 1].index ?? text.length : text.length;
      return text.slice(start, end).trim();
    })
    .filter(Boolean);

  if (items.length < 2) return null;

  return { lead: lead || undefined, items };
}
