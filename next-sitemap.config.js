/** @type {import('next-sitemap').IConfig} */

const countryVariant = process.env.NEXT_PUBLIC_COUNTRY_VARIANT ?? 'cs';

SITE_URLS = {
  cs: 'https://www.movapp.cz',
  sk: 'https://sk.movapp.eu',
  pl: 'https://pl.movapp.eu',
};

module.exports = {
  siteUrl: SITE_URLS[countryVariant],
  generateRobotsTxt: true,
  exclude: ['/404', '/uk/404'],
  priority: null,
  changefreq: null,
  generateIndexSitemap: false,
};
