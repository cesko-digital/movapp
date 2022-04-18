import { Phrase, TranslationJSON, isValidTranslationJSON } from 'utils/Phrase';
// JSON translation files
import Basic_CZ from './CZ/basic.json';
import Cas_CZ from './CZ/cas.json';
import HromadnaDoprava_CZ from './CZ/hromadna-doprava.json';
import Zoo_CZ from './CZ/zoo.json';
import NaNakupu_CZ from './CZ/na-nakupu.json';
import NaUrade_CZ from './CZ/na-urade.json';
import Obleceni_CZ from './CZ/obleceni.json';
import Drogerie_CZ from './CZ/drogerie.json';
import Penize_CZ from './CZ/penize.json';
import Prace_CZ from './CZ/prace.json';
import Rodina_CZ from './CZ/rodina.json';
import Doctor_CZ from './CZ/doctor.json';
import VDomacnosti_CZ from './CZ/vdomacnosti.json';
import VeMeste_CZ from './CZ/vemeste.json';
import VeSkole_CZ from './CZ/veskole.json';
import VeSkolce_CZ from './CZ/veskolce.json';
import Dobrovolnici_CZ from './CZ/dobrovolnici.json';
import ZradnaSlovicka_CZ from './CZ/zradna-slovicka.json';
import Velikonoce_CZ from './CZ/velikonoce.json';

export interface Category {
  nameMain: string;
  nameUk: string;
  translations: Phrase[];
}

const processTranslations = (translations: TranslationJSON[]) => {
  return translations.filter(isValidTranslationJSON).map((translation) => new Phrase(translation));
};

export const categories: Category[] = [
  {
    nameUk: 'Основні фрази',
    nameMain: 'Základní fráze',
    translations: processTranslations(Basic_CZ),
  },
  {
    nameMain: 'Velikonoce',
    nameUk: 'Великдень',
    translations: processTranslations(Velikonoce_CZ),
  },
  {
    nameMain: 'Rodina',
    nameUk: 'Родина',
    translations: processTranslations(Rodina_CZ),
  },
  {
    nameUk: 'Час',
    nameMain: 'Čas',
    translations: processTranslations(Cas_CZ),
  },
  {
    nameUk: 'Громадський транспорт',
    nameMain: 'Hromadná doprava',
    translations: processTranslations(HromadnaDoprava_CZ),
  },
  {
    nameUk: 'Їдемо в зоопарк',
    nameMain: 'Jedeme do ZOO',
    translations: processTranslations(Zoo_CZ),
  },
  {
    nameUk: 'Покупки',
    nameMain: 'Na nákupu',
    translations: processTranslations(NaNakupu_CZ),
  },
  {
    nameMain: 'Na úřadě',
    nameUk: 'В органах влади',
    translations: processTranslations(NaUrade_CZ),
  },
  {
    nameMain: 'Oblečení',
    nameUk: 'Одяг',
    translations: processTranslations(Obleceni_CZ),
  },
  {
    nameMain: 'Drogerie',
    nameUk: 'Побутова хімія (косметика)',
    translations: processTranslations(Drogerie_CZ),
  },
  {
    nameMain: 'Peníze',
    nameUk: 'Гроші',
    translations: processTranslations(Penize_CZ),
  },
  {
    nameMain: 'Práce',
    nameUk: 'Робота',
    translations: processTranslations(Prace_CZ),
  },
  {
    nameMain: 'U lékaře',
    nameUk: 'У лікаря',
    translations: processTranslations(Doctor_CZ),
  },
  {
    nameMain: 'V domácnosti',
    nameUk: 'Вдома',
    translations: processTranslations(VDomacnosti_CZ),
  },
  {
    nameMain: 'Ve městě',
    nameUk: 'У місті',
    translations: processTranslations(VeMeste_CZ),
  },
  {
    nameMain: 'Ve škole',
    nameUk: 'У школі',
    translations: processTranslations(VeSkole_CZ),
  },
  {
    nameMain: 'Ve školce',
    nameUk: 'У дитсадку',
    translations: processTranslations(VeSkolce_CZ),
  },
  {
    nameMain: 'Dobrovolníci',
    nameUk: 'Добровольці',
    translations: processTranslations(Dobrovolnici_CZ),
  },
  {
    nameMain: 'Zrádná slovíčka',
    nameUk: 'Слова із іншим значенням',
    translations: processTranslations(ZradnaSlovicka_CZ),
  },
];
