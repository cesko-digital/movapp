import { Category } from '../../../utils/getDataUtils';
import { Language } from '../../../utils/locales';
import { normalizeForId } from '../../../utils/textNormalizationUtils';
import { translitFromUkrainian } from '../../../utils/transliterate';

export const getCategoryName = (category: Category, currentLanguage: Language) => {
  const mainLanguageCategory = currentLanguage === 'uk' ? category.nameUk : category.nameMain;
  const secondaryLanguageCategory = currentLanguage === 'uk' ? category.nameMain : category.nameUk;
  return `${mainLanguageCategory}` + ' - ' + `${secondaryLanguageCategory}`;
};

// Used to link directly to category with dictionary#categoryId
export const getCategoryId = (category: Category, currentLanguage: Language) => {
  const text = currentLanguage === 'uk' ? translitFromUkrainian(category.nameUk) : category.nameMain;
  return normalizeForId(text);
};
