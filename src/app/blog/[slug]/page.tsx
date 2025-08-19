import { getPostAndMorePosts, Post } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import MotionDivWrapper from "@/components/MotionDivWrapper";
import BlockRendererClient from "@/components/BlockRendererClient";
import { Metadata } from "next";

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
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at center, #F7B3B9 0%, #FDE1B7 35%, #BFD9F5 70%, #D7C1F0 90%, #FDFCFD 100%)",
      }}
    >
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
        {morePosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-8">More Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {morePosts.map((p: Post) => (
                <Link href={`/blog/${p.slug}`} key={p.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {p.featuredImageUrl && (
                      <div className="relative h-48">
                        <Image
                          src={p.featuredImageUrl}
                          alt={p.featuredImageAlt || p.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                      <p className="text-gray-600 text-sm">{p.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
