import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/ui",
        destination: "/dashboard/labs/components",
        permanent: true,
      },
      {
        source: "/dashboard/ui/:path*",
        destination: "/dashboard/labs/components/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/fetchTests",
        destination: "/dashboard/labs/data-fetch/scraper-results",
        permanent: true,
      },
      {
        source: "/dashboard/fetchTests/:path*",
        destination: "/dashboard/labs/data-fetch/scraper-results/:path*",
        permanent: true,
      },
      {
        source: "/dashboard/fetchAccountTests",
        destination: "/dashboard/labs/data-fetch/account-scraper",
        permanent: true,
      },
      {
        source: "/dashboard/fetchAccountTests/:path*",
        destination: "/dashboard/labs/data-fetch/account-scraper/:path*",
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
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
