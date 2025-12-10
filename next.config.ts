import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos", "velog.velcdn.com"],
  },
};

export default nextConfig;
