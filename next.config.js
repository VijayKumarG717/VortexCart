/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/VortexCart',
  assetPrefix: '/VortexCart/',
};

module.exports = nextConfig; 