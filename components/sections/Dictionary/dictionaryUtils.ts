import { Category } from '../../../utils/getDataUtils';
import { Language } from '../../../utils/locales';
import { normalizeForId } from '../../../utils/textNormalizationUtils';
import { translitFromUkrainian } from '../../../utils/transliterate';

export const getCategoryName = (category: Category, currentLanguage: Language) => {
  const mainLanguageCategory = currentLanguage === 'uk' ? category.nameUk : category.nameMain;
  const secondaryLanguageCategory = currentLanguage === 'uk' ? category.nameMain : category.nameUk;
  return `${mainLanguageCategory}` + ' - ' + `${secondaryLanguageCategory}`;
};

/* 
Used to anchor-link directly to category with dictionary#categoryId
All links are in uk translit to not be mixed during web language change
*/
export const getCategoryId = (category: Category) => {
  const text = translitFromUkrainian(category.nameUk);
  return normalizeForId(text);
};
