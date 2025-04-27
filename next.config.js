/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
})

const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'export',
    images: {
        unoptimized: true,
    },
    // Get the repository name from environment or use empty string as fallback
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
}

module.exports = withPWA(nextConfig) 
