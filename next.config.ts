import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Add other config options here */
  serverActions: true,
  images: {
    domains: ["fixtura.s3.ap-southeast-2.amazonaws.com"], // Allow external images from this domain
  },
};

export default nextConfig;
