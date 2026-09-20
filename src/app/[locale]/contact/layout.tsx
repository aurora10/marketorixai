import type { Metadata } from 'next';
import { alternatesFor } from '@/lib/site';

/**
 * `page.tsx` for this route is a client component ("use client"), so it cannot
 * export metadata. Canonical + hreflang therefore live in this pass-through
 * layout. See src/lib/site.ts for the canonical host.
 */
export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Contact | Marketorix',
    alternates: alternatesFor(locale, '/contact'),
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
