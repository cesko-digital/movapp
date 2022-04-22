import { CountryVariant } from 'utils/countryVariant';

export type Language = CountryVariant | 'uk';

export const LOCALE_NAMES: Record<Language, string> = {
  cs: 'Česky',
  uk: 'Укр',
  pl: 'Polski',
  sk: 'Slovensky',
};
