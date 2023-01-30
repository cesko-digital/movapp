import 'i18next'; // before v13.0.0 -> import 'react-i18next';
import type common from '../public/locales/uk/common.json';

/** This file tells next-i18next package to strictly check that translation IDs passed to the
 * translation function `t` exist in the Ukrainian `common.json` file.
 *
 * `common.json` files of other languages are subsets of the the Ukrainian one (If not, you are probably doing something funky that
 *  should be handled by custom logic instead of next-i18next)
 *
 * TypeScript will now throw an error if we reference a non-existent translation by mistake.
 */
interface I18nNamespaces {
  common: typeof common;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: I18nNamespaces;
  }
}
