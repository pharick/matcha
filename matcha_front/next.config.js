/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'nginx',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'thispersondoesnotexist.com',
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
    ];
  },
};

module.exports = nextConfig;
