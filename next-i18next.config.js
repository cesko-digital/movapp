const path = require('path');

module.exports = {
  i18n: {
    locales: ['cs', 'uk'],
    defaultLocale: 'cs',
    localePath: path.resolve('./public/locales'),
    localeDetection: true,
  },
  trailingSlash: true,
};
