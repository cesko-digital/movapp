import Basic from './basic_sk.json';
import Cas from './cas_sk.json';
import HromadnaDoprava from './hromadna-doprava_sk.json';
import Zoo from './zoo_sk.json';
import NaNakupu from './na-nakupu_sk.json';
import NaUrade from './na-urade_sk.json';
import Obleceni from './obleceni_sk.json';
import Drogerie from './drogerie_sk.json';
import Penize from './penize_sk.json';
import Rodina from './rodina_sk.json';
import Doctor from './doctor_sk.json';
import VDomacnosti from './vdomacnosti_sk.json';
import VeMeste from './vemeste_sk.json';
import VeSkole from './veskole_sk.json';
import VeSkolce from './veskolce_sk.json';
import ZradnaSlovicka from './zradna-slovicka_sk.json';
import Velikonoce from './velikonoce_sk.json';
import Dobrovolnici from './dobrovnolnici_sk.json';
import { Category, processTranslations } from '../CategoryUtils';

export const CATEGORIES_SK: Category[] = [
  {
    nameMain: 'Základné frázy',
    nameUk: 'Основні фрази',
    translations: processTranslations(Basic),
  },
  {
    nameMain: 'Velká Noc',
    nameUk: 'Великдень',
    translations: processTranslations(Velikonoce),
  },
  {
    nameMain: 'Rodina',
    nameUk: 'Родина',
    translations: processTranslations(Rodina),
  },
  {
    nameMain: 'Čas',
    nameUk: 'Час',
    translations: processTranslations(Cas),
  },
  {
    nameMain: 'Hromadná doprava',
    nameUk: 'Громадський транспорт',
    translations: processTranslations(HromadnaDoprava),
  },
  {
    nameMain: 'Ideme do ZOO',
    nameUk: 'Їдемо в зоопарк',
    translations: processTranslations(Zoo),
  },
  {
    nameMain: 'Na nákupe',
    nameUk: 'Покупки',
    translations: processTranslations(NaNakupu),
  },
  {
    nameMain: 'Na úrade',
    nameUk: 'В органах влади',
    translations: processTranslations(NaUrade),
  },
  {
    nameMain: 'Oblečenie',
    nameUk: 'Одяг',
    translations: processTranslations(Obleceni),
  },
  {
    nameMain: 'Drogéria',
    nameUk: 'Побутова хімія (косметика)',
    translations: processTranslations(Drogerie),
  },
  {
    nameMain: 'Peniaze',
    nameUk: 'Гроші',
    translations: processTranslations(Penize),
  },
  {
    nameMain: 'U lekára',
    nameUk: 'У лікаря',
    translations: processTranslations(Doctor),
  },
  {
    nameMain: 'V domácnosti',
    nameUk: 'Вдома',
    translations: processTranslations(VDomacnosti),
  },
  {
    nameMain: 'V meste',
    nameUk: 'У місті',
    translations: processTranslations(VeMeste),
  },
  {
    nameMain: 'V škole',
    nameUk: 'У школі',
    translations: processTranslations(VeSkole),
  },
  {
    nameMain: 'V škôlke',
    nameUk: 'У дитсадку',
    translations: processTranslations(VeSkolce),
  },
  {
    nameMain: 'Zradné slovíčka',
    nameUk: 'Слова із іншим значенням',
    translations: processTranslations(ZradnaSlovicka),
  },
  {
    nameMain: 'Dobrovoľníci',
    nameUk: 'Добровольці',
    translations: processTranslations(Dobrovolnici),
  },
];
