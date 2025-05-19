/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/VortexCart' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/VortexCart/' : '',
  trailingSlash: true,
  distDir: 'out',
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/404': { page: '/404' },
    }
  },
};

module.exports = nextConfig; 