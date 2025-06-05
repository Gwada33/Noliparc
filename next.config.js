/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'noliparc.fr'],
    minimumCacheTTL: 60,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    path: '/_next/image',
    loader: 'default',
  },

  experimental: {
    optimizeCss: true,
    optimizeFonts: true,
    esmExternals: true,
    serverActions: true,
  },

  trailingSlash: true,
  swcMinify: true,

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
