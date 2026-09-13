/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://noliparc.fr',
  generateRobotsTxt: true,
  trailingSlash: true,
  // Les pages d'admin et d'auth ne doivent pas être indexées
  exclude: [
    '/admin*',
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/maintenance',
  ],
  transform: async (config, path) => {
    const clean = path.replace(/\/+$/, '');
    const priorities = {
      '': 1.0,
      '/nolijump': 0.9,
      '/anniversaires': 0.9,
      '/snack': 0.8,
      '/quad': 0.8,
      '/calendrier': 0.8,
      '/preview': 0.6,
      '/legal': 0.5,
    };
    return {
      loc: path,
      changefreq: 'daily',
      priority: priorities[clean] ?? 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
