const path = require('path');

const mainLanguage = process.env.NEXT_PUBLIC_COUNTRY_VARIANT ?? 'cs';

module.exports = {
  i18n: {
    locales: ['uk', mainLanguage],
    // eslint-disable-next-line no-process-env
    defaultLocale: mainLanguage,
    localePath: path.resolve('./public/locales'),
    localeDetection: false,
  },
  trailingSlash: true,
};
