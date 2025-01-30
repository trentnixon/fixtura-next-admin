import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Add other config options here */
  serverActions: true,
  images: {
    remotePatterns: [
      {
        hostname: "fixtura.s3.ap-southeast-2.amazonaws.com",
      },
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
