import { Language } from 'data/locales';
import { useTranslation } from 'next-i18next';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;
  const otherLanguage: Language = currentLanguage === 'uk' ? 'cs' : 'uk';
  const domainLanguage = process.env.NEXT_PUBLIC_COUNTRY_VARIANT || 'cs';

  return { currentLanguage, otherLanguage, domainLanguage };
};
