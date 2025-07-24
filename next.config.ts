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
  async redirects() {
    return [
      {
        source: '/robert',
        destination: 'https://robzi-portfollio.s3.eu-central-1.amazonaws.com/index-1.html',
        permanent: true, // Use false for a temporary redirect
      },
    ];
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
