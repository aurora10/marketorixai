"use client";

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';
import Link from 'next/link';

const BlockRendererClient = ({ content }: { content: any[] }) => {
  if (!content) return null;

  return (
    <BlocksRenderer
      content={content}
      blocks={{
        // Customize the rendering of each block
        heading: ({ children, level }) => {
          const Tag = `h${level}` as keyof JSX.IntrinsicElements;
          return <Tag className={`text-${6 - level}xl font-bold`}>{children}</Tag>;
        },
        // Use Next.js's Image component for optimized images
        image: ({ image }) => (
          <Image
            src={image.url}
            alt={image.alternativeText || ""}
            width={image.width}
            height={image.height}
            className="my-4 rounded-lg"
          />
        ),
        // Use Next.js's Link for client-side navigation
        link: ({ children, url }) => (
          <Link href={url} className="text-blue-500 hover:underline">
            {children}
          </Link>
        ),
      }}
    />
  );
};

export default BlockRendererClient;