import csCommon from '../../../public/locales/cs/common.json';
import skCommon from '../../../public/locales/sk/common.json';
import ukCommon from '../../../public/locales/uk/common.json';
import plCommon from '../../../public/locales/pl/common.json';

import { getObjectProperty } from '../../../utils/objectUtils';
import { Language } from '../../../utils/locales';

// I couldn't find a way to use `t` from useTranslate inside the Pdf component,
// but we are on the server so we can just access the translation JSONs directly
export const translateInPdf = (locale: Language, key: string) => {
  let dictionary: Record<string, unknown> = csCommon;
  if (locale === 'uk') {
    dictionary = ukCommon;
  } else if (locale === 'sk') {
    dictionary = skCommon;
  } else if (locale === 'pl') {
    dictionary = plCommon;
  }
  return getObjectProperty(dictionary, key);
};
