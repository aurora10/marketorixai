import { getPostAndMorePosts, getPostBySlug } from "@/lib/api";
import { permanentRedirect } from "next/navigation";
import Image from 'next/image';
import BlockRendererClient from "@/components/BlockRendererClient";
import { Metadata } from "next";
import Header from "@/components/Header";
import Link from "next/link";
import InteractiveScrollToTop from "@/components/InteractiveScrollToTop";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string, locale: string } }): Promise<Metadata> {
  const { slug, locale } = params;
  const post = await getPostBySlug(slug, locale);

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

export default async function PostPage({ params }: { params: { slug: string, locale: string } }) {
  const { slug, locale } = params;
  const { post, morePosts } = await getPostAndMorePosts(slug, locale);

  if (!post) {
    permanentRedirect('/');
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at center, #F7B3B9 0%, #FDE1B7 35%, #BFD9F5 70%, #D7C1F0 90%, #FDFCFD 100%)",
      }}
    >
      <Header darkMode={true} />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
            <div className="mb-8">
              {/* Use localized link */}
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8 transition-colors"
              >
                ← Back to Blog
              </Link>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-8">
              {post.title}
            </h1>
            <div className="flex items-center text-lg text-gray-600 justify-center mb-8">
              <Image
                src={"/user.png"}
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
            {post.featuredImageUrl && (
              <Image
                src={post.featuredImageUrl}
                alt={post.title}
                width={1200}
                height={630}
                className="w-full h-auto rounded-lg mb-8 max-w-xl mx-auto"
              />
            )}
            <article>
              <div className="prose max-w-none text-base font-normal text-gray-600 leading-6">
                <BlockRendererClient content={post.contentBlocks} />
              </div>
            </article>
          </div>
        </div>
      </main>

      {morePosts.length > 0 && (
        <aside className="py-12 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">More Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {morePosts.map((post) => (
                <a key={post.slug} href={`/${locale}/blog/${post.slug}`} className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  {post.featuredImageUrl && (
                    <Image
                      src={post.featuredImageUrl}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
