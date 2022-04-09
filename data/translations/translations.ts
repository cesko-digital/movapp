import { Phrase } from './../../components/utils/Phrase';
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
import Dobrovolnici from './dobrovolnici.json';
import ZradnaSlovicka from './zradna-slovicka.json';

export interface Category {
  category_name_cz: string;
  category_name_ua: string;
  translations: Phrase[];
}

export const categories: Category[] = [
  {
    category_name_ua: 'Основні фрази',
    category_name_cz: 'Základní fráze',
    translations: Basic.map((translation) => new Phrase(translation)),
  },
  {
    category_name_ua: 'Корисні фрази',
    category_name_cz: 'Užitečné fráze',
    translations: UzitecneFraze.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Rodina',
    category_name_ua: 'Родина',
    translations: Rodina.map((translation) => new Phrase(translation)),
  },
  {
    category_name_ua: 'Час',
    category_name_cz: 'Čas',
    translations: Cas.map((translation) => new Phrase(translation)),
  },
  {
    category_name_ua: 'Громадський транспорт',
    category_name_cz: 'Hromadná doprava',
    translations: HromadnaDoprava.map((translation) => new Phrase(translation)),
  },
  {
    category_name_ua: 'Їдемо в зоопарк',
    category_name_cz: 'Jedeme do ZOO',
    translations: Zoo.map((translation) => new Phrase(translation)),
  },
  {
    category_name_ua: 'Покупки',
    category_name_cz: 'Na nákupu',
    translations: NaNakupu.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Na úřadě',
    category_name_ua: 'В органах влади',
    translations: NaUrade.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Oblečení',
    category_name_ua: 'Одяг',
    translations: Obleceni.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Drogerie',
    category_name_ua: 'Побутова хімія (косметика)',
    translations: Drogerie.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Peníze',
    category_name_ua: 'Гроші',
    translations: Penize.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'U lékaře',
    category_name_ua: 'У лікаря',
    translations: Doctor.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'V domácnosti',
    category_name_ua: 'Вдома',
    translations: VDomacnosti.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Ve městě',
    category_name_ua: 'У місті',
    translations: VeMeste.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Ve škole',
    category_name_ua: 'У школі',
    translations: VeSkole.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Ve školce',
    category_name_ua: 'У дитсадку',
    translations: VeSkolce.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Dobrovolníci',
    category_name_ua: 'Добровольці',
    translations: Dobrovolnici.map((translation) => new Phrase(translation)),
  },
  {
    category_name_cz: 'Zrádná slovíčka',
    category_name_ua: 'Слова із іншим значенням',
    translations: ZradnaSlovicka.map((translation) => new Phrase(translation)),
  },
];
