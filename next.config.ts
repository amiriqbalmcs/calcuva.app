import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Vercel optimization: No need for 'output: export' or 'trailingSlash'
     Vercel handles these automatically and better than a static server. */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
