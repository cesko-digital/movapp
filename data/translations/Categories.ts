import { CATEGORIES_SK } from './SK/categories_SK';
import { CATEGORIES_CZ } from './CZ/categories_CZ';
import { getCountryVariant } from 'utils/locales';

export const getAllCategories = () => {
  if (getCountryVariant() === 'sk') {
    return CATEGORIES_SK;
  } else {
    return CATEGORIES_CZ;
  }
};
