/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
        },
      ],
    },
    experimental: {
      serverActions: true,
    },
    redirects() {
      return [
        {
          source: '/profile',
          destination: '/profile/information',
          permanent: true,
        },
      ]
    }
}

module.exports = nextConfig
