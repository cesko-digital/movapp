const path = require('path');

module.exports = {
  i18n: {
    locales: ['cz', 'ua'],
    defaultLocale: 'cz',
    localePath: path.resolve('./public/locales'),
    localeDetection: false,
  },
  trailingSlash: true,
};
