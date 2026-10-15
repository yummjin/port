import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos", "velog.velcdn.com"],
  },
  async redirects() {
    return [
      { source: "/projects", destination: "/work", permanent: true },
      { source: "/projects/:id", destination: "/work/:id", permanent: true },
    ];
  },
};

export default nextConfig;
