/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig 