import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  publicRuntimeConfig: {
    env: process.env.NEXT_PUBLIC_ENV || 'development',
    apiUrl: process.env.API_URL,
  },
};

export default nextConfig;
