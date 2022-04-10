import { Phrase, isValidTranslationJSON, TranslationJSON } from './../../utils/Phrase';
// JSON translation files
import Basic from './basic.json';
import Cas from './cas.json';
import HromadnaDoprava from './hromadna-doprava.json';
import Zoo from './zoo.json';
import NaNakupu from './na-nakupu.json';
import NaUrade from './na-urade.json';
import Obleceni from './obleceni.json';
import Drogerie from './drogerie.json';
import Penize from './penize.json';
import Rodina from './rodina.json';
import Doctor from './doctor.json';
import VDomacnosti from './vdomacnosti.json';
import VeMeste from './vemeste.json';
import VeSkole from './veskole.json';
import VeSkolce from './veskolce.json';
import Dobrovolnici from './dobrovolnici.json';
import ZradnaSlovicka from './zradna-slovicka.json';
import Velikonoce from './velikonoce.json';

export interface Category {
  category_name_cz: string;
  category_name_ua: string;
  translations: Phrase[];
}

const processTranslations = (translations: TranslationJSON[]) => {
  return translations.filter(isValidTranslationJSON).map((translation) => new Phrase(translation));
};

export const categories: Category[] = [
  {
    category_name_ua: 'Основні фрази',
    category_name_cz: 'Základní fráze',
    translations: processTranslations(Basic),
  },
  {
    category_name_cz: 'Velikonoce',
    category_name_ua: 'Великдень',
    translations: processTranslations(Velikonoce),
  },
  {
    category_name_cz: 'Rodina',
    category_name_ua: 'Родина',
    translations: processTranslations(Rodina),
  },
  {
    category_name_ua: 'Час',
    category_name_cz: 'Čas',
    translations: processTranslations(Cas),
  },
  {
    category_name_ua: 'Громадський транспорт',
    category_name_cz: 'Hromadná doprava',
    translations: processTranslations(HromadnaDoprava),
  },
  {
    category_name_ua: 'Їдемо в зоопарк',
    category_name_cz: 'Jedeme do ZOO',
    translations: processTranslations(Zoo),
  },
  {
    category_name_ua: 'Покупки',
    category_name_cz: 'Na nákupu',
    translations: processTranslations(NaNakupu),
  },
  {
    category_name_cz: 'Na úřadě',
    category_name_ua: 'В органах влади',
    translations: processTranslations(NaUrade),
  },
  {
    category_name_cz: 'Oblečení',
    category_name_ua: 'Одяг',
    translations: processTranslations(Obleceni),
  },
  {
    category_name_cz: 'Drogerie',
    category_name_ua: 'Побутова хімія (косметика)',
    translations: processTranslations(Drogerie),
  },
  {
    category_name_cz: 'Peníze',
    category_name_ua: 'Гроші',
    translations: processTranslations(Penize),
  },
  {
    category_name_cz: 'U lékaře',
    category_name_ua: 'У лікаря',
    translations: processTranslations(Doctor),
  },
  {
    category_name_cz: 'V domácnosti',
    category_name_ua: 'Вдома',
    translations: processTranslations(VDomacnosti),
  },
  {
    category_name_cz: 'Ve městě',
    category_name_ua: 'У місті',
    translations: processTranslations(VeMeste),
  },
  {
    category_name_cz: 'Ve škole',
    category_name_ua: 'У школі',
    translations: processTranslations(VeSkole),
  },
  {
    category_name_cz: 'Ve školce',
    category_name_ua: 'У дитсадку',
    translations: processTranslations(VeSkolce),
  },
  {
    category_name_cz: 'Dobrovolníci',
    category_name_ua: 'Добровольці',
    translations: processTranslations(Dobrovolnici),
  },
  {
    category_name_cz: 'Zrádná slovíčka',
    category_name_ua: 'Слова із іншим значенням',
    translations: processTranslations(ZradnaSlovicka),
  },
];
