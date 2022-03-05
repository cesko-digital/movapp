import { Translation } from '../components/basecomponents/TranslationContainer';

// JSON translation files
import TimeTranslations from '../new-translations/time.json';
import Transport from '../new-translations/transport.json';

interface TranslationsType {
  category_name_cz: string;
  category_name_ua: string;
  translations: Translation[];
}

export const translations: TranslationsType[] = [
  {
    category_name_ua: 'Час',
    category_name_cz: 'Čas',
    translations: TimeTranslations,
  },
  {
    category_name_ua: 'Громадський транспорт',
    category_name_cz: 'Hromadná doprava',
    translations: Transport,
  },
];
