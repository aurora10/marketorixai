import qs from "qs";

// Defines the structure of a single blog post
interface Post {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  featuredImageUrl?: string;
  featuredImageAlt?: string;
  contentBlocks: any[];
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

const STRAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://0.0.0.0:1337";

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

  const url = `${STRAPI_URL}/api/posts?${query}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch posts from ${url}`);
  }

  const responseData = await res.json();

  return {
    posts: responseData.data.map((item: any) => {
      return {
        id: item.id,
        title: item.title || "Untitled Post",
        excerpt: item.excerpt || "",
        slug: item.slug || "",
        featuredImageUrl: item.featuredImage?.url
          ? `${STRAPI_URL}${item.featuredImage.url}`
          : undefined,
        featuredImageAlt: item.featuredImage?.alternativeText,
        contentBlocks: item.contentBlocks || [],
      };
    }) as Post[],
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

  const url = `${STRAPI_URL}/api/posts?${query}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch post from ${url}`);
  }

  const responseData = await res.json();

  if (!Array.isArray(responseData.data) || responseData.data.length === 0) {
    return null;
  }

  const postData = responseData.data[0];
  if (!postData) {
    return null;
  }
  const post = postData;

  return {
    id: post.id,
    title: post.title || "Untitled Post",
    excerpt: post.excerpt || "",
    slug: post.slug || "",
    featuredImageUrl: post.featuredImage?.url
      ? `${STRAPI_URL}${post.featuredImage.url}`
      : undefined,
    featuredImageAlt: post.featuredImage?.alternativeText,
    contentBlocks: post.contentBlocks.flatMap((block: any) => {
      if (block.__component === 'content.rich-text-block') {
        return block.content;
      }
      return [];
    }) || [],
  };
}

export { getPosts, getPost };
export type { Post };
