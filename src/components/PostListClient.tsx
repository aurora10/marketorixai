"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { getPosts, Post } from "@/lib/api";

interface PostListClientProps {
  initialPosts: Post[];
  initialHasMore: boolean;
}

const POSTS_PER_PAGE = 5;

export default function PostListClient({
  initialPosts,
  initialHasMore,
}: PostListClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const loader = useRef(null);

  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const result = await getPosts(page, POSTS_PER_PAGE);
      setPosts((prevPosts) => [...prevPosts, ...result.posts]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(result.pagination.page < result.pagination.pageCount);
    } catch (error) {
      console.error("Failed to load more posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMorePosts();
        }
      },
      { root: null, rootMargin: "20px", threshold: 1.0 }
    );

    const currentLoader = loader.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [loadMorePosts]);

  return (
    <>
      <div className="grid gap-12">
        {posts.map((post: Post) => (
          <Link href={`/blog/${post.slug}`} key={post.id}>
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-8">
              {post.featuredImageUrl && (
                <div className="float-right ml-4 mb-4 w-1/3 h-48 md:h-64 relative">
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain"
                  />
                </div>
              )}
              <h2 className="font-bold text-gray-800 mb-4" style={{ fontSize: '25px' }}>
                {post.title}
              </h2>
              <p className="text-gray-600 leading-relaxed" style={{ fontSize: '14px' }}>{post.excerpt}</p>
            </article>
          </Link>
        ))}
      </div>
      {hasMore && (
        <div ref={loader} className="text-center py-4">
          {loading ? <p>Loading more posts...</p> : <p>Scroll down to load more</p>}
        </div>
      )}
      {!hasMore && !loading && posts.length > 0 && (
        <p className="text-center text-gray-600 py-4">
          You have reached the end of the posts.
        </p>
      )}
    </>
  );
}
