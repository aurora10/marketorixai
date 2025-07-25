import PostListClient from "@/components/PostListClient";
import { getPosts } from "@/lib/api";
import Header from "@/components/Header";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const POSTS_PER_PAGE = 5;
  const result = await getPosts(1, POSTS_PER_PAGE);
  const initialPosts = result.posts;
  const initialHasMore = result.pagination.page < result.pagination.pageCount;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header darkMode={true} />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
            Latest Blog Posts
          </h1>
          <div className="bg-white rounded-lg shadow-md p-8">
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
