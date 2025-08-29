// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;
