import Basic from './basic_pl.json';
import Cas from './cas_pl.json';
import HromadnaDoprava from './hromadna-doprava_pl.json';
import Zoo from './zoo_pl.json';
import NaNakupu from './na-nakupu_pl.json';
import NaUrade from './na-urade_pl.json';
import Obleceni from './obleceni_pl.json';
import Drogerie from './drogerie_pl.json';
import Penize from './penize_pl.json';
import Prace from './prace_pl.json';
import Rodina from './rodina_pl.json';
import Doctor from './doctor_pl.json';
import VDomacnosti from './vdomacnosti_pl.json';
import VeMeste from './vemeste_pl.json';
import VeSkole from './veskole_pl.json';
import VeSkolce from './veskolce_pl.json';
import Dobrovolnici from './dobrovolnici_pl.json';
import ZradnaSlovicka from './zradna-slovicka_pl.json';
import Velikonoce from './velikonoce_pl.json';
import { Category, processTranslations } from '../CategoryUtils';

export const CATEGORIES_PL: Category[] = [
  {
    nameMain: 'Podstawowe zwroty',
    nameUk: 'Основні фрази',
    translations: processTranslations(Basic),
  },
  {
    nameMain: 'Święta Wielkanocne',
    nameUk: 'Великдень',
    translations: processTranslations(Velikonoce),
  },
  {
    nameMain: 'Rodzina',
    nameUk: 'Родина',
    translations: processTranslations(Rodina),
  },
  {
    nameMain: 'Czas',
    nameUk: 'Час',
    translations: processTranslations(Cas),
  },
  {
    nameMain: 'Komunikacja miejska',
    nameUk: 'Громадський транспорт',
    translations: processTranslations(HromadnaDoprava),
  },
  {
    nameMain: 'Jedziemy do ZOO',
    nameUk: 'Їдемо в зоопарк',
    translations: processTranslations(Zoo),
  },
  {
    nameMain: 'Na zakupach',
    nameUk: 'Покупки',
    translations: processTranslations(NaNakupu),
  },
  {
    nameMain: 'W urzędzie',
    nameUk: 'В органах влади',
    translations: processTranslations(NaUrade),
  },
  {
    nameMain: 'Ubrania',
    nameUk: 'Одяг',
    translations: processTranslations(Obleceni),
  },
  {
    nameMain: 'Drogeria',
    nameUk: 'Побутова хімія (косметика)',
    translations: processTranslations(Drogerie),
  },
  {
    nameMain: 'Pieniądze',
    nameUk: 'Гроші',
    translations: processTranslations(Penize),
  },

  {
    nameMain: 'Praca',
    nameUk: 'Робота',
    translations: processTranslations(Prace),
  },
  {
    nameMain: 'U lekarza',
    nameUk: 'У лікаря',
    translations: processTranslations(Doctor),
  },
  {
    nameMain: 'W domu',
    nameUk: 'Вдома',
    translations: processTranslations(VDomacnosti),
  },
  {
    nameMain: 'Na mieście',
    nameUk: 'У місті',
    translations: processTranslations(VeMeste),
  },
  {
    nameMain: 'W szkole',
    nameUk: 'У школі',
    translations: processTranslations(VeSkole),
  },
  {
    nameMain: 'W przedszkolu',
    nameUk: 'У дитсадку',
    translations: processTranslations(VeSkolce),
  },
  {
    nameMain: 'Wolontariat',
    nameUk: 'Добровольці',
    translations: processTranslations(Dobrovolnici),
  },
  {
    nameMain: 'Podstępne słówka',
    nameUk: 'Слова із іншим значенням',
    translations: processTranslations(ZradnaSlovicka),
  },
];
