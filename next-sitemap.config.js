/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

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
const PDF_LINKS = ['/(pdf){2}|^(?!.*[.]pdf$).*$/'];

/** @type {Object<string,Array<string>>}} */
const EXCLUSIONS = {
  cs: ['/exercise/re*', '/uk/exercise/re*', ' /kiosk/*', '/uk/kiosk/*', ...PDF_LINKS],
  sk: ['/wiki*', '/uk/wiki*', '/exercise/re*', '/uk/exercise/re*', ' /kiosk/*', '/uk/kiosk/*', ...PDF_LINKS],
  pl: ['/wiki*', '/uk/wiki*', '/exercise/re*', '/uk/exercise/re*', ' /kiosk/*', '/uk/kiosk/*', ...PDF_LINKS],
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URLS[countryVariant],
  generateRobotsTxt: true,
  exclude: ['/404', '/uk/404', '', ...EXCLUSIONS[countryVariant]],
  priority: null,
  changefreq: null,
  generateIndexSitemap: false,
  additionalPaths: async (config) => {
    const result = [];

    // get list of files from folder public/pdf
    const pdfPath = path.join(process.cwd(), 'public', 'pdf');
    const pdfFiles = await fs.promises.readdir(pdfPath);

    // add pdf files to sitemap
    pdfFiles.forEach(async (file) => {
      result.push(await config.transform(config, `${SITE_URLS[countryVariant]}/pdf/${encodeURIComponent(file)}`));
    });

    return result;
  },
};
