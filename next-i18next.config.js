const path = require('path');

module.exports = {
  i18n: {
    locales: ['cs', 'uk', 'sk'],
    // eslint-disable-next-line no-process-env
    defaultLocale: process.env.NEXT_PUBLIC_COUNTRY_VARIANT ?? 'cs',
    localePath: path.resolve('./public/locales'),
    localeDetection: true,
  },
  trailingSlash: true,
};
