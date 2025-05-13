/** @type {import('next').NextConfig} */
const nextConfig = {
  // TypeScript settings
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // ESLint settings
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // React settings
  reactStrictMode: true,
  
  // Image settings - combined from both configs
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'media.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
      protocol: 'https',
      hostname: 'howtocook-frontend-iuuqsnke3-edwardzehuazhangs-projects.vercel.app',
      }
    ]
  },
  
  // Webpack configuration for SVG support
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

module.exports = nextConfig;