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
            <div key={index} className="my-4">
              <BlocksRenderer content={block.content} />
            </div>
          );
        } else if (block.__component === 'content-blocks.body') {
          return (
            <div key={index} className="my-4">
              <BlocksRenderer content={block.body} />
            </div>
          );
        } else if (block.__component === 'content-blocks.image-block') {
          const image = block.image?.data?.[0]?.attributes;
          if (!image) return null;

          const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || '';
          const imageUrl = image.url.startsWith('http') ? image.url : `${STRAPI_URL}${image.url}`;

          return (
            <div key={index} className="my-8 flex justify-center">
              <Image
                src={imageUrl}
                alt={image.alternativeText || 'Image'}
                width={image.width}
                height={image.height}
                className="rounded-lg shadow-lg"
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