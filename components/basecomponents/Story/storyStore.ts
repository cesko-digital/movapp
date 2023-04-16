import oDvanactiMesickach from '../../../data/translations/cs/pohadka_mesicky.json';
import oPernikoveChaloupce from '../../../data/translations/cs/pohadka_pernikovachaloupka.json';
import oCerveneKarkulce from '../../../data/translations/cs/pohadka_karkulka.json';
import oKoblizkovi from '../../../data/translations/cs/pohadka_koblizek.json';
import oIvasikovi from '../../../data/translations/cs/pohadka_ivasik.json';
import oHusach from '../../../data/translations/cs/pohadka_husy.json';
import { Language } from 'utils/locales';

export type PhraseInfo = { language: Language; time: number };

export interface StoryPhrase {
  main: string;
  uk: string;
  start_cs: number;
  end_cs: number;
  start_uk: number;
  end_uk: number;
}

export const STORIES: Record<string, StoryPhrase[]> = {
  'pernikova-chaloupka': oPernikoveChaloupce,
  'dvanact-mesicku': oDvanactiMesickach,
  'cervena-karkulka': oCerveneKarkulce,
  kolobok: oKoblizkovi,
  'husy-lebedi': oHusach,
  'ivasik-telesik': oIvasikovi,
};
