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
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
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

// Defines the structure for a sitemap post
interface SitemapPost {
  slug: string;
  updatedAt: string;
}

// Fetches a list of posts with pagination
export async function getPosts(
  page: number,
  pageSize: number
): Promise<PaginatedPosts> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!STRAPI_URL) {
    console.error("NEXT_PUBLIC_STRAPI_API_URL environment variable is not set.");
    return {
      posts: [],
      pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 },
    };
  }

  const query = qs.stringify(
    {
      sort: ["createdAt:desc"],
      pagination: {
        page,
        pageSize,
      },
      populate: {
        main_image: {
          fields: ["url", "alternativeText"],
        },
        content_blocks: {
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
  let responseData;
  try {
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`Failed to fetch posts from ${url}`);
      return {
        posts: [],
        pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 },
      };
    }

    responseData = await res.json();
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      posts: [],
      pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 },
    };
  }

  return {
    posts: responseData.data.map((item: any) => {
      const attributes = item.attributes;

      let featuredImageUrl: string | undefined = undefined;
      let featuredImageAlt: string | undefined = undefined;

      // First, try to get the featured image from the dedicated field
      if (attributes.main_image?.data?.attributes?.url) {
        featuredImageUrl = `${STRAPI_URL}${attributes.main_image.data.attributes.url}`;
        featuredImageAlt = attributes.main_image.data.attributes.alternativeText;
      } else if (attributes.content_blocks && attributes.content_blocks.length > 0) {
        // If not found, search for the first image in contentBlocks
        const imageBlock = attributes.content_blocks.find(
          (block: any) =>
            block.__component === 'content.media' && block.image?.data
        );
        if (imageBlock) {
          featuredImageUrl = `${STRAPI_URL}${imageBlock.image.data.attributes.url}`;
          featuredImageAlt = imageBlock.image.data.attributes.alternativeText;
        }
      }

      return {
        id: item.id,
        title: attributes.title || "Untitled Post",
        excerpt: attributes.excerpt || "",
        slug: attributes.slug || "",
        featuredImageUrl,
        featuredImageAlt,
        contentBlocks: attributes.content_blocks || [],
        createdAt: attributes.createdAt,
        updatedAt: attributes.updatedAt || new Date().toISOString(),
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
export async function getPost(slug: string): Promise<Post | null> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!STRAPI_URL) {
    console.error("NEXT_PUBLIC_STRAPI_API_URL environment variable is not set.");
    return null;
  }

  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: {
        main_image: {
          fields: ["url", "alternativeText"],
        },
        content_blocks: {
          populate: "*",
        },
      },
      fields: ["title", "excerpt", "slug", "createdAt", "metaTitle", "metaDescription"],
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `${STRAPI_URL}/api/posts?${query}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });

    if (!res.ok) {
      console.error(`Failed to fetch post from ${url}`);
      return null;
    }

    const responseData = await res.json();

    if (!Array.isArray(responseData.data) || responseData.data.length === 0) {
      return null;
    }

    const postData = responseData.data[0];
    if (!postData) {
      return null;
    }
    const post = postData.attributes;

    return {
      id: postData.id,
      title: post.title || "Untitled Post",
      excerpt: post.excerpt || "",
      slug: post.slug || "",
      featuredImageUrl: post.main_image?.data?.attributes?.url
        ? `${STRAPI_URL}${post.main_image.data.attributes.url}`
        : undefined,
      featuredImageAlt: post.main_image?.data?.attributes?.alternativeText,
      contentBlocks: post.content_blocks || [],
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Fetches all posts for the sitemap
export async function getAllPostsForSitemap(): Promise<SitemapPost[]> {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  if (!STRAPI_URL) {
    console.error("NEXT_PUBLIC_STRAPI_API_URL environment variable is not set.");
    return [];
  }

  const query = qs.stringify(
    {
      fields: ["slug", "updatedAt"],
      pagination: {
        pageSize: 1000, // Adjust as needed
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `${STRAPI_URL}/api/posts?${query}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      console.error(`Failed to fetch posts for sitemap from ${url}`);
      return [];
    }

    const responseData = await res.json();

    if (!Array.isArray(responseData.data)) {
      return [];
    }

    return responseData.data.map((item: any) => ({
      slug: item.attributes.slug,
      updatedAt: item.attributes.updatedAt || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error);
    return [];
  }
}


export type { Post, SitemapPost };