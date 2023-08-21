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
        hostname: 'randomuser.me',
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
    swcMinify: false,
};

module.exports = nextConfig;
