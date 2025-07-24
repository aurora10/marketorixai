# Strapi Blog Integration Guide for Next.js Projects

## 1. Prerequisites

- Existing Strapi backend with content types (Post, Content Blocks)
- Next.js project (version 14 or newer)
- Install dependencies: `npm install qs @types/qs`

## 2. API Integration Setup

### src/lib/api.ts

```typescript
interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
}

import qs from "qs";

interface PaginatedPosts {
  posts: Post[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

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

  const baseUrl =
    typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";

  const res = await fetch(`${baseUrl}/api/posts?${query}`);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error("Failed to fetch posts");
  }

  const responseData = await res.json();

  if (!Array.isArray(responseData.data)) {
    return {
      posts: [],
      pagination: {
        page,
        pageSize,
        pageCount: 0,
        total: 0,
      },
    };
  }

  return {
    posts: responseData.data.map((item: any) => ({
      id: item.id,
      title: item.title || "Untitled Post",
      excerpt: item.excerpt || "",
      slug: item.slug || "",
      featuredImageUrl: item.featuredImage?.url
        ? `${
            typeof window === "undefined"
              ? process.env.NEXT_PUBLIC_API_BASE_URL
              : ""
          }${item.featuredImage.url}`
        : undefined,
      featuredImageAlt: item.featuredImage?.alternativeText,
    })),
    pagination: responseData.meta?.pagination || {
      page,
      pageSize,
      pageCount: 0,
      total: 0,
    },
  };
}

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

  const baseUrl =
    typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_BASE_URL : "";

  const res = await fetch(`${baseUrl}/api/posts?${query}`);
  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const responseData = await res.json();

  if (!Array.isArray(responseData.data) || responseData.data.length === 0) {
    return null;
  }

  const post = responseData.data[0];
  return {
    id: post.id,
    title: post.title || "Untitled Post",
    excerpt: post.excerpt || "",
    slug: post.slug || "",
    featuredImageUrl: post.featuredImage?.url
      ? `${
          typeof window === "undefined"
            ? process.env.NEXT_PUBLIC_API_BASE_URL
            : ""
        }${post.featuredImage.url}`
      : undefined,
    featuredImageAlt: post.featuredImage?.alternativeText,
  };
}

export { getPosts, getPost };
export type { Post };
```

## 3. Environment Configuration

### .env.local

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:1337
```

## 4. Next.js Configuration

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:1337/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://localhost:1337/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
```

## 5. Page Components

### src/app/blog.tsx

```tsx
import PostListClient from "./PostListClient";
import { getPosts } from "../lib/api";

export default async function Home() {
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

### src/app/PostListClient.tsx

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { getPosts, Post } from "../lib/api";

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
    setLoading(true);
    try {
      const result = await getPosts(page, POSTS_PER_PAGE);
      setPosts((prevPosts) => [...prevPosts, ...result.posts]);
      setPage((prevPage) => prevPage + 1);
      setHasMore(result.pagination.page < result.pagination.pageCount);
    } catch (error) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          loadMorePosts();
        }
      },
      { root: null, rootMargin: "20px", threshold: 1.0 }
    );

    const currentLoader = loader.current;
    if (currentLoader) observer.observe(currentLoader);

    return () => {
      if (currentLoader) observer.unobserve(currentLoader);
    };
  }, [hasMore, loading, loadMorePosts]);

  return (
    <>
      <div className="grid gap-12">
        {posts.map((post: Post) => (
          <Link href={`/post/${post.slug}`} key={post.id}>
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
          {loading ? (
            <p>Loading more posts...</p>
          ) : (
            <p>Scroll down to load more</p>
          )}
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
```

### src/app/post/[slug]/page.tsx

```tsx
import qs from "qs";
import Image from "next/image";
import React from "react";

interface ImageFormat {
  url: string;
}

interface ImageData {
  id: number;
  alternativeText: string;
  width: number;
  height: number;
  url: string;
}

interface TextChild {
  type: "text";
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
}

interface ParagraphContent {
  type: "paragraph";
  children: TextChild[];
}
interface HeadingContent {
  type: "heading";
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: TextChild[];
}
interface ListContent {
  type: "list";
  format: "ordered" | "unordered";
  children: any[];
}
interface QuoteContent {
  type: "quote";
  children: TextChild[];
}
interface CodeContent {
  type: "code";
  children: TextChild[];
}

type RichTextBlockContent =
  | ParagraphContent
  | HeadingContent
  | ListContent
  | QuoteContent
  | CodeContent;

interface RichTextBlockType {
  __component: "content.rich-text-block";
  id: number;
  content: RichTextBlockContent[];
}

interface ImageBlockType {
  __component: "content.image-block";
  id: number;
  caption: string;
  image: ImageData;
}

interface VideoBlockType {
  __component: "content.video-block";
  id: number;
  caption: string;
  videoUrl: string;
}

interface GalleryBlockType {
  __component: "content.gallery-block";
  id: number;
  images: ImageData[];
}

type ContentBlock =
  | RichTextBlockType
  | ImageBlockType
  | VideoBlockType
  | GalleryBlockType;

interface Post {
  title: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  contentBlocks: ContentBlock[];
}

async function getPost(
  slug: string
): Promise<{ post: Post | null; rawResponse: string }> {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      populate: {
        featuredImage: { fields: ["url", "alternativeText"] },
        contentBlocks: { populate: "*" },
      },
    },
    { encodeValuesOnly: true }
  );

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");

  const res = await fetch(`${baseUrl}/api/posts?${query}`);
  const rawResponse = await res.text();
  if (!res.ok) return { post: null, rawResponse };

  try {
    const { data } = JSON.parse(rawResponse);
    if (!data.length) return { post: null, rawResponse };

    const postData = data[0];
    return {
      post: {
        title: postData.title,
        featuredImageUrl: postData.featuredImage?.url
          ? `${baseUrl}${postData.featuredImage.url}`
          : undefined,
        featuredImageAlt: postData.featuredImage?.alternativeText,
        contentBlocks: postData.contentBlocks,
      },
      rawResponse,
    };
  } catch (error) {
    return { post: null, rawResponse };
  }
}

const RichTextBlock = ({ block }: { block: RichTextBlockType }) => {
  const renderText = (children: RichTextBlockContent["children"]) =>
    children.map((child, j) =>
      child.type === "text" ? (
        <span key={j} dangerouslySetInnerHTML={{ __html: child.text }} />
      ) : null
    );

  return (
    <div className="prose lg:prose-xl max-w-none mb-8">
      {block.content.map((item, i) => {
        switch (item.type) {
          case "paragraph":
            return (
              <p key={i} style={{ marginBottom: "1em" }}>
                {renderText(item.children)}
              </p>
            );
          case "heading":
            const HeadingTag = `h${item.level}` as keyof JSX.IntrinsicElements;
            return (
              <HeadingTag key={i} style={{ fontWeight: "bold" }}>
                {renderText(item.children)}
              </HeadingTag>
            );
          default:
            return <p key={i}>{renderText(item.children)}</p>;
        }
      })}
    </div>
  );
};

const ImageBlock = ({ block }: { block: ImageBlockType }) => (
  <figure className="mb-8">
    {block.image?.url ? (
      <Image
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${block.image.url}`}
        alt={block.image.alternativeText || block.caption}
        width={block.image.width || 800}
        height={block.image.height || 600}
        className="w-full h-auto rounded-lg shadow-md"
      />
    ) : (
      <div className="w-full bg-gray-200 rounded-lg shadow-md flex items-center justify-center aspect-video">
        <p className="text-gray-500">Image not available</p>
      </div>
    )}
    {block.caption && (
      <figcaption className="text-center text-sm text-gray-500 mt-2">
        {block.caption}
      </figcaption>
    )}
  </figure>
);

const VideoBlock = ({ block }: { block: VideoBlockType }) => {
  const getYouTubeVideoId = (url: string): string | null =>
    url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]{11}).*/
    )?.[2] || null;

  const videoId = getYouTubeVideoId(block.videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;

  return (
    <figure className="mb-8">
      {embedUrl ? (
        <iframe
          className="w-full h-auto aspect-video rounded-lg shadow-md"
          src={embedUrl}
          title={block.caption || "YouTube video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <div className="w-full bg-gray-200 rounded-lg shadow-md flex items-center justify-center aspect-video">
          <p className="text-gray-500">Invalid video URL</p>
        </div>
      )}
      {block.caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-2">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
};

const GalleryBlock = ({ block }: { block: GalleryBlockType }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
    {block.images.map((image, index) => (
      <div
        key={index}
        className="relative w-full h-48 overflow-hidden rounded-lg shadow-md"
      >
        <Image
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image.url}`}
          alt={image.alternativeText || "Gallery image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
    ))}
  </div>
);

const DynamicContent = ({ block }: { block: ContentBlock }) => {
  switch (block.__component) {
    case "content.rich-text-block":
      return <RichTextBlock block={block} />;
    case "content.image-block":
      return <ImageBlock block={block} />;
    case "content.video-block":
      return <VideoBlock block={block} />;
    case "content.gallery-block":
      return <GalleryBlock block={block} />;
    default:
      return <p>Unsupported block type</p>;
  }
};

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const { post, rawResponse } = await getPost(slug);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-left text-gray-800 mb-4">
          Raw API Response:
        </h1>
        <pre
          className="bg-gray-800 text-white p-4 rounded-lg shadow-md mb-8"
          style={{ whiteSpace: "pre-wrap" }}
        >
          <code>{rawResponse}</code>
        </pre>

        {post ? (
          <article className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-center text-gray-800 mb-8">
              {post.title}
            </h1>
            {post.featuredImageUrl && (
              <Image
                src={post.featuredImageUrl}
                alt={post.featuredImageAlt || post.title}
                width={1200}
                height={600}
                className="w-full h-auto rounded-lg shadow-md mb-12"
              />
            )}
            <div className="bg-white rounded-lg shadow-md p-8">
              {post.contentBlocks.map((block) => (
                <DynamicContent key={`block-${block.id}`} block={block} />
              ))}
            </div>
          </article>
        ) : (
          <h1 className="text-5xl font-bold text-center text-gray-800 mt-12">
            Post not found
          </h1>
        )}
      </main>
    </div>
  );
}
```

## 6. Testing Procedures

1. Start Strapi: `npm run develop`
2. Run Next.js: `npm run dev`
3. Verify:
   - Home page shows paginated posts
   - Clicking posts opens detail pages
   - Images load without CORS issues
   - Content blocks render correctly

## 7. Key Files to Reference

- `src/lib/api.ts`
- `src/app/blog.tsx`
- `src/app/PostListClient.tsx`
- `src/app/post/[slug]/page.tsx`
- `next.config.js`
- `.env.local`
