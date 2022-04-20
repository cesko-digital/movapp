import { CATEGORIES_SK } from './SK/categories_SK';
import { CATEGORIES_CZ } from './CZ/categories_CZ';

export const getAllCategories = () => {
  // eslint-disable-next-line no-process-env
  if (process.env.NEXT_PUBLIC_COUNTRY_VARIANT === 'SK') {
    return CATEGORIES_SK;
  } else {
    return CATEGORIES_CZ;
  }
};
