// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': '.',
      '@/app': './app',
      '@/components': './components',
      '@/lib': './lib',
      '@/types': './types',
      '@/hooks': './app/hooks',
      '@/utils': './lib/utils',
    };
    return config;
  },
};

export default nextConfig;