import { ua2sk } from './../data/transliterations/ua2sk';
import { sk2ua } from './../data/transliterations/sk2ua';
import { pl2ua } from './../data/transliterations/pl2ua';
import { ua2cz } from 'data/transliterations/ua2cz';
import { cz2ua } from './../data/transliterations/cz2ua';
import { ua2pl } from 'data/transliterations/ua2pl';
import { CountryVariant, getCountryVariant } from './locales';

type TranslitSubstitutionTable = [string, string][];

const removePunctuation = (str: string) => str.replace('.', '').replace('?', '').replace('!', '');

export const translit = (subs: TranslitSubstitutionTable, text: string) => {
  let result = text;
  for (let i = 0; i < subs.length; i++) {
    // Vercel's Node 14 does not support String.replaceAll(), so we must use a RegEx workaround
    result = result.replace(new RegExp(subs[i][0], 'g'), subs[i][1]);
  }
  return removePunctuation(result);
};

const FROM_UK_TABLES: Record<CountryVariant, TranslitSubstitutionTable> = {
  cs: ua2cz,
  pl: ua2pl,
  sk: ua2sk,
};

const TO_UK_TABLES: Record<CountryVariant, TranslitSubstitutionTable> = {
  cs: cz2ua,
  pl: pl2ua,
  sk: sk2ua,
};

export const translitFromUkrainian = (text: string) => translit(FROM_UK_TABLES[getCountryVariant()], text);
export const translitToUkrainian = (text: string) => translit(TO_UK_TABLES[getCountryVariant()], text);
