import { getPost } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import MotionDivWrapper from "@/components/MotionDivWrapper";
import BlockRendererClient from "@/components/BlockRendererClient";

export const dynamic = 'force-dynamic';

type PostPageProps = {
  params: {
    slug: string;
  };
};

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/blog" className="text-gray-500 hover:text-gray-700 flex items-center">
              Back to Blog
            </Link>
          </div>
          <MotionDivWrapper>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {post.title}
            </h1>
            {post.featuredImageUrl && (
              <img
                src={post.featuredImageUrl}
                alt={post.featuredImageAlt || post.title}
                className="w-full h-auto rounded-lg mb-8"
              />
            )}
            <BlockRendererClient content={post.contentBlocks} />
          </MotionDivWrapper>
        </div>
      </main>
    </div>
  );
}