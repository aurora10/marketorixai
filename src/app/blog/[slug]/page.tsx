import { getPost } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import MotionDivWrapper from "@/components/MotionDivWrapper";
import BlockRendererClient from "@/components/BlockRendererClient";
import ReactMarkdown from 'react-markdown';
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

type PostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This post could not be found.",
    };
  }

  const defaultImageUrl = "https://www.marketorix.com/logo.png";

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url: `/blog/${post.slug}`,
      siteName: 'Marketorix AI',
      images: [
        {
          url: post.featuredImageUrl || defaultImageUrl,
          width: 1200,
          height: 630,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      creator: '@marketorix',
      images: [post.featuredImageUrl || defaultImageUrl],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.featuredImageUrl,
    author: {
      '@type': 'Person',
      name: 'Marketorix AI',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Marketorix AI',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.marketorix.com/logo.png',
      },
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    description: post.excerpt,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto prose">
          <div className="mb-8">
            <Link href="/blog" className="text-gray-500 hover:text-gray-700 flex items-center no-underline">
              Back to Blog
            </Link>
          </div>
          <MotionDivWrapper>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            {post.featuredImageUrl && (
              <Image
                src={post.featuredImageUrl}
                alt={post.featuredImageAlt || post.title}
                width={1200}
                height={630}
                className="w-full h-auto rounded-lg mb-8 max-w-xl mx-auto"
                priority
              />
            )}
            
            <BlockRendererClient content={post.contentBlocks} />
          </MotionDivWrapper>
        </div>
      </main>
    </div>
  );
}