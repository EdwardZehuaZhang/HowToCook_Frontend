/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['github.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'media.githubusercontent.com',
      }
    ]
  },
  reactStrictMode: true,
};

module.exports = nextConfig;