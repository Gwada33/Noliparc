/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'imgupscaler.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ewyyikh0ws.ufs.sh', pathname: '/**' },
      { protocol: 'https', hostname: 'www.noliparc.fr', pathname: '/**' },
      { protocol: 'https', hostname: 'noliparc.fr', pathname: '/**' },
    ],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: '/_next/image',
    loader: 'default',
  },

  turbopack: {
    root: path.resolve(__dirname),
  },

  trailingSlash: true,

  env: {
    API_URL: process.env.API_URL || 'http://localhost:3000',
  },

  // Configuration pour le développement
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=31536000, stale-while-revalidate=2592000',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
