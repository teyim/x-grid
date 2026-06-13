import type { NextConfig } from "next";

const canonicalUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://socialgridtool.xyz'
).replace(/\/$/, '');

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'x-grid-ruddy.vercel.app',
          },
        ],
        destination: `${canonicalUrl}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
