import { Translation } from '../components/basecomponents/TranslationContainer';
// JSON translation files
import TimeTranslations from '../new-translations/time.json';
import Transport from '../new-translations/transport.json';
import ZOO from '../new-translations/zoo.json';
import Groceries from '../new-translations/groceries.json';
import Government from '../new-translations/government.json';
import ClothesAndSelfcare from '../new-translations/clothes.json';
import Money from '../new-translations/money.json';
import Family from '../new-translations/family.json';
import Doctor from '../new-translations/doctor.json';

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
  {
    category_name_ua: 'Їдемо в зоопарк',
    category_name_cz: 'Jedeme do ZOO',
    translations: ZOO,
  },
  {
    category_name_ua: 'Покупки',
    category_name_cz: 'Na nákupu',
    translations: Groceries,
  },
  {
    category_name_cz: 'Na úřadě',
    category_name_ua: 'В органах влади',
    translations: Government,
  },
  {
    category_name_cz: 'Oblečení + drogerie',
    category_name_ua: 'Одяг + побутова хімія (косметика)',
    translations: ClothesAndSelfcare,
  },
  {
    category_name_cz: 'Peníze',
    category_name_ua: 'Гроші',
    translations: Money,
  },
  {
    category_name_cz: 'Rodina',
    category_name_ua: 'Родина',
    translations: Family,
  },

  {
    category_name_cz: 'U lékaře',
    category_name_ua: 'У лікаря',
    translations: Doctor,
  },
];
