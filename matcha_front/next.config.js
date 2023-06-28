/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost/api/:path*/',
          },
        ]
    },
    trailingSlash: true,
}

module.exports = nextConfig
