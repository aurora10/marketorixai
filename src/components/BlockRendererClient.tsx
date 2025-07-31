"use client";

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import Link from 'next/link';

const BlockRendererClient = ({ content }: { content: any[] }) => {
  if (!content) return null;

  return (
    <>
      {content.map((block, index) => {
        if (block.__component === 'content-blocks.video-embed') {
          return (
            <div key={index} className="my-4">
              {/* You'll need to embed the video player here, e.g., using an iframe */}
              <iframe
                width="560"
                height="315"
                src={block.video_url.replace("watch?v=", "embed/")}
                title={block.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          );
        } else if (block.__component === 'content.rich-text-block') {
          // Assuming rich-text-block content is an array of Strapi blocks
          return (
            <div key={index} className="prose lg:prose-xl my-4">
              <BlocksRenderer
                content={block.content}
                blocks={{
                  heading: ({ children, level }) => {
                    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                    return <Tag className={`text-${6 - level}xl font-bold`}>{children}</Tag>;
                  },
                  image: ({ image }) => (
                    <Image
                      src={image.url}
                      alt={image.alternativeText || ""}
                      width={image.width}
                      height={image.height}
                      className="my-4 rounded-lg"
                    />
                  ),
                  link: ({ children, url }) => (
                    <Link href={url} className="text-blue-500 hover:underline">
                      {children}
                    </Link>
                  ),
                }}
              />
            </div>
          );
        } else if (block.__component === 'content-blocks.body') {
          return (
            <div key={index} className="prose lg:prose-xl my-4">
              <BlocksRenderer
                content={block.body}
                blocks={{
                  heading: ({ children, level }) => {
                    const Tag = `h${level}` as keyof JSX.IntrinsicElements;
                    return <Tag className={`text-${6 - level}xl font-bold`}>{children}</Tag>;
                  },
                  image: ({ image }) => (
                    <Image
                      src={image.url}
                      alt={image.alternativeText || ""}
                      width={image.width}
                      height={image.height}
                      className="my-4 rounded-lg"
                    />
                  ),
                  link: ({ children, url }) => (
                    <Link href={url} className="text-blue-500 hover:underline">
                      {children}
                    </Link>
                  ),
                }}
              />
            </div>
          );
        }
        // Fallback for any unhandled block types
        return <p key={index}>Unhandled block type: {block.__component}</p>;
      })}
    </>
  );
};

export default BlockRendererClient;