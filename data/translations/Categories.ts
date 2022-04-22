import { CATEGORIES_SK } from './SK/categories_SK';
import { CATEGORIES_CZ } from './CZ/categories_CZ';
import { getCountryVariant } from 'utils/countryVariant';

export const getAllCategories = () => {
  // eslint-disable-next-line no-process-env
  if (getCountryVariant() === 'SK') {
    return CATEGORIES_SK;
  } else {
    return CATEGORIES_CZ;
  }
};
