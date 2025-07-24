# Strapi Blog Integration Guide for This Project

This guide provides step-by-step instructions to integrate a Strapi-powered blog into this Next.js application.

## 1. Prerequisites

- **Strapi Backend**: Ensure your Strapi backend is running and accessible at `http://0.0.0.0:1337`.
- **Content Types**: Your Strapi instance should have the following content types configured:
  - `Post` (with fields like `title`, `excerpt`, `slug`, `featuredImage`, `contentBlocks`)
  - `Content Blocks` (Dynamic Zone with components for rich text, images, videos, etc.)
- **Dependencies**: Install the necessary packages for handling API requests and query strings.

  ```bash
  npm install qs @types/qs
  ```

## 2. API Integration Setup

Create a new file to handle all communication with the Strapi API.

### `src/lib/api.ts`

This file will contain functions to fetch posts and individual post details from Strapi.

```typescript
import qs from "qs";

// Defines the structure of a single blog post
interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
}

// Defines the structure for a paginated list of posts
interface PaginatedPosts {
  posts: Post[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

// Fetches a list of posts with pagination
async function getPosts(
  page: number,
  pageSize: number
): Promise<PaginatedPosts> {
  const query = qs.stringify(
    {
      sort: ["createdAt:desc"],
      pagination: {
        page,
        pageSize,
      },
      populate: {
        featuredImage: {
          fields: ["url", "alternativeText"],
        },
      },
      fields: ["title", "excerpt", "slug", "createdAt"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://0.0.0.0:1337";

  const res = await fetch(`${baseUrl}/api/posts?${query}`);

  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }

  const responseData = await res.json();

  return {
    posts: responseData.data.map((item: any) => ({
      id: item.id,
      title: item.attributes.title || "Untitled Post",
      excerpt: item.attributes.excerpt || "",
      slug: item.attributes.slug || "",
      featuredImageUrl: item.attributes.featuredImage?.data?.attributes.url
        ? `${baseUrl}${item.attributes.featuredImage.data.attributes.url}`
        : undefined,
      featuredImageAlt: item.attributes.featuredImage?.data?.attributes.alternativeText,
    })),
    pagination: responseData.meta?.pagination || {
      page,
      pageSize,
      pageCount: 0,
      total: 0,
    },
  };
}

// Fetches a single post by its slug
async function getPost(slug: string): Promise<Post | null> {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        featuredImage: {
          fields: ["url", "alternativeText"],
        },
        contentBlocks: {
          populate: "*",
        },
      },
      fields: ["title", "excerpt", "slug", "createdAt"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://0.0.0.0:1337";

  const res = await fetch(`${baseUrl}/api/posts?${query}`);
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const responseData = await res.json();

  if (!Array.isArray(responseData.data) || responseData.data.length === 0) {
    return null;
  }

  const post = responseData.data[0].attributes;
  return {
    id: responseData.data[0].id,
    title: post.title || "Untitled Post",
    excerpt: post.excerpt || "",
    slug: post.slug || "",
    featuredImageUrl: post.featuredImage?.data?.attributes.url
      ? `${baseUrl}${post.featuredImage.data.attributes.url}`
      : undefined,
    featuredImageAlt: post.featuredImage?.data?.attributes.alternativeText,
    ...post,
  };
}

export { getPosts, getPost };
export type { Post };
```

## 3. Environment Configuration

Create a `.env.local` file in the root of your project to store the Strapi API base URL.

### `.env.local`

```bash
NEXT_PUBLIC_API_BASE_URL=http://0.0.0.0:1337
```

## 4. Next.js Configuration

Update your `next.config.ts` to allow images from the Strapi domain and set up rewrites to proxy API requests. This avoids CORS issues and hides the Strapi URL from the client.

### `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "0.0.0.0",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://0.0.0.0:1337/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://0.0.0.0:1337/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
```

## 5. Page Components

Create the necessary pages and components to display the blog posts.

### `src/app/blog/page.tsx`

This page will fetch and display the list of blog posts.

```tsx
import PostListClient from "@/components/PostListClient";
import { getPosts } from "@/lib/api";

export default async function BlogPage() {
  const POSTS_PER_PAGE = 5;
  const result = await getPosts(1, POSTS_PER_PAGE);
  const initialPosts = result.posts;
  const initialHasMore = result.pagination.page < result.pagination.pageCount;

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Latest Blog Posts
      </h1>
      <PostListClient
        initialPosts={initialPosts}
        initialHasMore={initialHasMore}
      />
    </main>
  );
}
```

### `src/components/PostListClient.tsx`

This client component handles infinite scrolling for the blog posts.

```tsx
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
            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex">
              <div className="p-8 flex-grow">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {post.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
              </div>
              {post.featuredImageUrl && (
                <div className="w-1/3 flex-shrink-0 relative h-48 md:h-64">
                  <Image
                    src={post.featuredImageUrl}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
            </article>
          </Link>
        ))}
      </div>
      {hasMore && (
        <div ref={loader} className="text-center py-4">
          {loading ? <p>Loading...</p> : <p>Load more</p>}
        </div>
      )}
    </>
  );
}
```

### `src/app/blog/[slug]/page.tsx`

This page displays the content of a single blog post.

```tsx
import { getPost } from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";

// Define interfaces for Strapi's dynamic content blocks
// (These should match the structure of your Strapi components)
// ... (RichTextBlock, ImageBlock, etc. interfaces from the guide)

const DynamicContent = ({ block }: { block: any }) => {
  switch (block.__component) {
    // case "content.rich-text-block":
    //   return <RichTextBlock block={block} />;
    // ... other block types
    default:
      return <pre>{JSON.stringify(block, null, 2)}</pre>;
  }
};

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12">
      <h1 className="text-5xl font-bold text-center mb-8">{post.title}</h1>
      {post.featuredImageUrl && (
        <div className="relative h-96 w-full mb-12">
          <Image
            src={post.featuredImageUrl}
            alt={post.featuredImageAlt || post.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        {/* @ts-ignore */}
        {post.contentBlocks.map((block) => (
          <DynamicContent key={`block-${block.id}`} block={block} />
        ))}
      </div>
    </article>
  );
}
```

## 6. Testing Procedures

1.  **Start Strapi**: Navigate to your Strapi project directory and run `npm run develop`.
2.  **Run Next.js**: In this project directory, run `npm run dev`.
3.  **Verify**:
    -   Open your browser to `http://localhost:3000/blog`. You should see a list of your latest blog posts.
    -   Scroll down to test the infinite scroll functionality.
    -   Click on a post to navigate to its detail page (e.g., `http://localhost:3000/blog/your-post-slug`).
    -   Verify that the post content, including images and dynamic blocks, renders correctly.
