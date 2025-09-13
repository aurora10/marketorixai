"use client";

import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from 'next/image';

const getYouTubeVideoId = (url: string) => {
  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      if (urlObj.pathname.startsWith('/live/')) {
        videoId = urlObj.pathname.substring(6);
      } else {
        videoId = urlObj.searchParams.get('v');
      }
    } else if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.substring(1);
    }
  } catch (error) {
    console.error("Invalid URL for YouTube video", error);
  }
  return videoId;
};

const BlockRendererClient = ({ content }: { content: any[] }) => {
  if (!content) return null;

  return (
    <>
      {content.map((block, index) => {
        if (block.__component === 'content-blocks.video-embed') {
          const videoId = getYouTubeVideoId(block.video_url);

          if (videoId) {
            return (
              <div key={index} className="my-4">
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={block.title || 'YouTube video player'}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          } else {
            // Fallback for non-YouTube videos
            return (
              <div key={index} className="my-4">
                <video controls width="560" height="315">
                  <source src={block.video_url} />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          }
        } else if (block.__component === 'content.rich-text-block') {
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
        return <p key={index}>Unhandled block type: {block.__component}</p>;
      })}
    </>
  );
};

export default BlockRendererClient;