// @ts-check
/** @type {import('next-sitemap').IConfig} */

/** @type {string} */
const countryVariant = process.env.NEXT_PUBLIC_COUNTRY_VARIANT ?? 'cs';

/** @type {Object<string,string>} */
const SITE_URLS = {
  cs: 'https://www.movapp.cz',
  sk: 'https://sk.movapp.eu',
  pl: 'https://pl.movapp.eu',
};

/** @type {Array<string>} */
const PDF_LINKS = ['*/dictionary/pdf/*', '*/kids/stories/pdf/*', '*/alphabet/pdf/*'];

/** @type {Object<string,Array<string>>}} */
const EXCLUSIONS = {
  cs: [...PDF_LINKS],
  sk: ['/wiki*', '/uk/wiki*', ...PDF_LINKS],
  pl: ['/wiki*', '/uk/wiki*', ...PDF_LINKS],
};

module.exports = {
  siteUrl: SITE_URLS[countryVariant],
  generateRobotsTxt: true,
  exclude: ['/404', '/uk/404', '', ...EXCLUSIONS[countryVariant]],
  priority: null,
  changefreq: null,
  generateIndexSitemap: false,
};
