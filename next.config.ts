import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', 
      },
      {
        protocol: 'http',
        hostname: '**', 
      },
    ],
    domains: [
      "graphicsfamily.com",
      "img.freepik.com",
      "encrypted-tbn0.gstatic.com",
      "as2.ftcdn.net",
      "images-platform.99static.com",
      "dypdvfcjkqkg2.cloudfront.net",
    ],
  },
   experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
