import { getCountryVariant } from 'utils/countryVariant';
import { Language } from 'data/locales';
import { useTranslation } from 'next-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;
  const otherLanguage: Language = currentLanguage === 'uk' ? getCountryVariant() : 'uk';

  return { currentLanguage, otherLanguage };
};
