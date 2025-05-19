/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    domains: ['fakestoreapi.com', 'images.unsplash.com'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/VijayMart' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/VijayMart/' : '',
};

module.exports = nextConfig; 