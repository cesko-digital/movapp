import 'i18next'; // before v13.0.0 -> import 'react-i18next';
import type common from '../public/locales/uk/common.json';

/** This file tells next-18n-next package to strictly checked that translation IDs passed to the
 * translation function `t` exist in the Ukrainian common.json file.
 * Common.json files of other languages are subsets of the the Ukrainian one.
 * This should throw an error us if we reference a non-existent translation by mistake.
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
