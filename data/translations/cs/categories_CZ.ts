import Basic_CZ from './basic.json';
import Cas_CZ from './cas.json';
import HromadnaDoprava_CZ from './hromadna-doprava.json';
import Zoo_CZ from './zoo.json';
import NaNakupu_CZ from './na-nakupu.json';
import NaUrade_CZ from './na-urade.json';
import Obleceni_CZ from './obleceni.json';
import Drogerie_CZ from './drogerie.json';
import Penize_CZ from './penize.json';
import Prace_CZ from './prace.json';
import Rodina_CZ from './rodina.json';
import Doctor_CZ from './doctor.json';
import VDomacnosti_CZ from './vdomacnosti.json';
import VeMeste_CZ from './vemeste.json';
import VeSkole_CZ from './veskole.json';
import VeSkolce_CZ from './veskolce.json';
import Dobrovolnici_CZ from './dobrovolnici.json';
import ZradnaSlovicka_CZ from './zradna-slovicka.json';
import Velikonoce_CZ from './velikonoce.json';
import { Category, processTranslations } from '../CategoryUtils';

export const CATEGORIES_CZ: Category[] = [
  {
    nameMain: 'Základní fráze',
    nameUk: 'Основні фрази',
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
    nameMain: 'Čas',
    nameUk: 'Час',
    translations: processTranslations(Cas_CZ),
  },
  {
    nameMain: 'Hromadná doprava',
    nameUk: 'Громадський транспорт',
    translations: processTranslations(HromadnaDoprava_CZ),
  },
  {
    nameMain: 'Jedeme do ZOO',
    nameUk: 'Їдемо в зоопарк',
    translations: processTranslations(Zoo_CZ),
  },
  {
    nameMain: 'Na nákupu',
    nameUk: 'Покупки',
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
