/** @type {import('next').NextConfig} */

const { i18n } = require('./next-i18next.config');

const nextConfig = {
  reactStrictMode: true,
  i18n,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.module.rules.push({
      test: /\.(mp3)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/sounds/',
          outputPath: 'static/sounds/',
          name: '[hash].[ext]',
          esModule: false,
        },
      },
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/cz',
        destination: '/',
        permanent: true,
      },
      {
        source: '/ua/:path*',
        destination: '/uk/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
