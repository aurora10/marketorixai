import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: '/robert',
        destination: 'https://robzi-portfollio.s3.eu-central-1.amazonaws.com/index-1.html',
        permanent: true, // Use false for a temporary redirect
      },
    ];
  },
};

export default nextConfig;
