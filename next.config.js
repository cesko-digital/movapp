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
      {
        source: '/movapp-cover.jpg',
        destination: '/icons/movapp-cover.jpg',
        permanent: true,
      },
      {
        source: '/omalovanky.pdf',
        destination: '/kids/omalovanky.pdf',
        permanent: true,
      },
      {
        source: '/raketa', // Short link printed into magazine Raketa to Raketa dictionary category
        destination: '/dictionary#casopis_raketa_detem',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
