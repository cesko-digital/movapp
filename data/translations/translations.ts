import { Translation } from 'components/basecomponents/TranslationsContainer';
// JSON translation files
import Basic from './basic.json';
import UzitecneFraze from './uzitecne-fraze.json';
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
import ZradnaSlovicka from './zradna-slovicka.json';

export interface TranslationsType {
  category_name_cz: string;
  category_name_ua: string;
  translations: Translation[];
}

export const translations: TranslationsType[] = [
  {
    category_name_ua: 'Основні фрази',
    category_name_cz: 'Základní fráze',
    translations: Basic,
  },
  {
    category_name_ua: 'Корисні фрази',
    category_name_cz: 'Užitečné fráze',
    translations: UzitecneFraze,
  },
  {
    category_name_cz: 'Rodina',
    category_name_ua: 'Родина',
    translations: Rodina,
  },
  {
    category_name_ua: 'Час',
    category_name_cz: 'Čas',
    translations: Cas,
  },
  {
    category_name_ua: 'Громадський транспорт',
    category_name_cz: 'Hromadná doprava',
    translations: HromadnaDoprava,
  },
  {
    category_name_ua: 'Їдемо в зоопарк',
    category_name_cz: 'Jedeme do ZOO',
    translations: Zoo,
  },
  {
    category_name_ua: 'Покупки',
    category_name_cz: 'Na nákupu',
    translations: NaNakupu,
  },
  {
    category_name_cz: 'Na úřadě',
    category_name_ua: 'В органах влади',
    translations: NaUrade,
  },
  {
    category_name_cz: 'Oblečení',
    category_name_ua: 'Одяг',
    translations: Obleceni,
  },
  {
    category_name_cz: 'Drogerie',
    category_name_ua: 'Побутова хімія (косметика)',
    translations: Drogerie,
  },
  {
    category_name_cz: 'Peníze',
    category_name_ua: 'Гроші',
    translations: Penize,
  },
  {
    category_name_cz: 'U lékaře',
    category_name_ua: 'У лікаря',
    translations: Doctor,
  },
  {
    category_name_cz: 'V domácnosti',
    category_name_ua: 'Вдома',
    translations: VDomacnosti,
  },
  {
    category_name_cz: 'Ve městě',
    category_name_ua: 'У місті',
    translations: VeMeste,
  },
  {
    category_name_cz: 'Ve škole',
    category_name_ua: 'У школі',
    translations: VeSkole,
  },
  {
    category_name_cz: 'Ve školce',
    category_name_ua: 'У дитсадку',
    translations: VeSkolce,
  },
  {
    category_name_cz: 'Zrádná slovíčka',
    category_name_ua: 'Слова із іншим значенням',
    translations: ZradnaSlovicka,
  },
];
