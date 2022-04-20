export type CountryVariant = 'CZ' | 'SK' | 'PL';

/**
 * The country variant is chosen based on the NEXT_PUBLIC_COUNTRY_VARIANT environmnet variable.
 *
 * You can define it locally by creating a '.env.local' file in the root folder containing:
 * NEXT_PUBLIC_COUNTRY_VARIANT=SK
 * This file is not tracked by the git repository.
 *
 * For deployment, the environment variables are defined inside Vercel, we deploy one build
 * for each country variant on its own (sub)domain.
 */

export const getCountryVariant = (): CountryVariant => {
  // eslint-disable-next-line no-process-env
  const countryEnvVariable = process.env.NEXT_PUBLIC_COUNTRY_VARIANT;
  if (countryEnvVariable === 'SK') {
    return 'SK';
  }
  if (countryEnvVariable === 'PL') {
    return 'PL';
  }
  return 'CZ';
};
