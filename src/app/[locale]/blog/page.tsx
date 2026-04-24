import PostListClient from "@/components/PostListClient";
import { getPosts } from "@/lib/api";
import Header from "@/components/Header";
import { Metadata } from 'next';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  return {
    title: 'Latest Blog Posts | Marketorix',
    description: 'Read the latest updates and insights from Marketorix.',
    alternates: {
      canonical: `https://www.marketorix.com/${locale}/blog`,
      languages: {
        'en': `https://www.marketorix.com/en/blog`,
        'nl': `https://www.marketorix.com/nl/blog`,
        'x-default': `https://www.marketorix.com/en/blog`,
      },
    },
  };
}

export default async function BlogPage({ params: { locale } }: { params: { locale: string } }) {
  const POSTS_PER_PAGE = 5;
  const result = await getPosts(1, POSTS_PER_PAGE);
  const initialPosts = result.posts;
  const initialHasMore = result.pagination.page < result.pagination.pageCount;

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
          <h1 className="text-3xl md:text-5xl font-bold text-center text-gray-800 mb-8">
            Latest Blog Posts
          </h1>
          <div className="bg-white rounded-lg shadow-md p-4 md:p-8">
            <PostListClient
              initialPosts={initialPosts}
              initialHasMore={initialHasMore}
            />
          </div>
        </div>
      </main>
    </div>
  );
}