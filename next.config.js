/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: '/risk-analyzer',
  async rewrites() {
    return [
      {
        source: '/risk-analyzer',
        destination: '/',
      },
    ];
  },
};

module.exports = nextConfig; 