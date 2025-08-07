import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "graphicsfamily.com",
      "img.freepik.com",
      "encrypted-tbn0.gstatic.com",
      "as2.ftcdn.net",
      "images-platform.99static.com",
      "dypdvfcjkqkg2.cloudfront.net",
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
