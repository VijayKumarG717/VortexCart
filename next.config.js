/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['fakestoreapi.com', 'images.unsplash.com'],
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/VortexCart' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/VortexCart/' : '',
};

module.exports = nextConfig; 