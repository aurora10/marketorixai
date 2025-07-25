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

const STRAPI_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// if (!STRAPI_URL) {
//   throw new Error("NEXT_PUBLIC_STRAPI_API_URL environment variable is not set.");
// }

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
  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Failed to fetch posts from ${url}`);
      return {
        posts: [],
        pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 },
      };
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
  } catch (error) {
    console.error("Error fetching posts:", error);
    return {
      posts: [],
      pagination: { page: 1, pageSize: 10, pageCount: 0, total: 0 },
    };
  }
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
  try {
    const res = await fetch(url);

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
      contentBlocks:
        post.contentBlocks.flatMap((block: any) => {
          if (block.__component === "content.rich-text-block") {
            return block.content;
          }
          return [];
        }) || [],
    };
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export { getPosts, getPost };
export type { Post };
