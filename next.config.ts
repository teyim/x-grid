import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      '127.0.0.1',
      // add your production Supabase storage domain here too, e.g.:
      // 'your-project-id.supabase.co'
    ],
  },
};

export default nextConfig;
