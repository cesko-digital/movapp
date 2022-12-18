import { TFuncKey } from 'i18next';

/** Use this type for strings passed to next-i18next translation functions like `t` */
export type TranslationId = TFuncKey<'common'>;

/**
 * Our site has multiple country variants, each containing two locales/languages:
 * Czech country variant: Czech, Ukrainian,
 * Slovak country variant: Slovak Ukrainian, etc.
 */
export type CountryVariant = 'cs' | 'sk' | 'pl';
export type Language = CountryVariant | 'uk';

/**
 * The country variant is chosen based on the NEXT_PUBLIC_COUNTRY_VARIANT environment variable.
 *
 * You can define it locally by creating a '.env.local' file in the root folder containing:
 * NEXT_PUBLIC_COUNTRY_VARIANT=sk
 * This file is not tracked by the git repository.
 *
 * For deployment, the environment variables are defined inside Vercel, we deploy one build
 * for each country variant on its own (sub)domain.
 *
 * *** Your code must work in all country variants ***
 *
 *  -> Never specify the main language directly, as in phrase.getTranslation('cs').
 *  -> Always use getCountryVariant to dynamically use the current country variant.
 *  -> Always use the useLanguage hook, as in const { currentLanguage } = useLanguage();,
 *     to get the currently selected language (Ukrainian or the main language of the country variant).
 */
export const getCountryVariant = (): CountryVariant => {
  // eslint-disable-next-line no-process-env
  const countryEnvVariable = process.env.NEXT_PUBLIC_COUNTRY_VARIANT;
  if (countryEnvVariable === 'sk') {
    return 'sk';
  }
  if (countryEnvVariable === 'pl') {
    return 'pl';
  }
  return 'cs';
};

export const LOCALE_NAMES: Record<Language, string> = {
  cs: 'Česky',
  uk: 'Українська',
  pl: 'Polski',
  sk: 'Slovensky',
};

export const includesCurrentVariant = (variants: CountryVariant[] | readonly CountryVariant[]) => variants.includes(getCountryVariant());
