import { getPostAndMorePosts, Post } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import MotionDivWrapper from "@/components/MotionDivWrapper";
import BlockRendererClient from "@/components/BlockRendererClient";
import { Metadata } from "next";
import Header from "@/components/Header";
import InteractiveScrollToTop from "@/components/InteractiveScrollToTop";

export const dynamic = 'force-dynamic';

type PostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { post } = await getPostAndMorePosts(params.slug);

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
  const { post, morePosts } = await getPostAndMorePosts(params.slug);

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
    description: post.metaDescription || post.excerpt,
  };

  return (
    <div className="relative text-white min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-lg text-gray-400">
              <Image
                src={"/default-author.png"}
                alt={"Marketorix"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-4"
              />
              <div>
                <span>By Marketorix</span>
                <span className="mx-2">•</span>
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}</span>
              </div>
            </div>
          </header>

          {post.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {post.excerpt}
            </p>
          )}

          <div className="prose prose-lg prose-invert max-w-none">
            <BlockRendererClient content={post.contentBlocks} />
          </div>
        </article>
      </main>

      <footer className="py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2023 Marketorix. All rights reserved.</p>
        </div>
      </footer>

      <InteractiveScrollToTop />
    </div>
  );
}
