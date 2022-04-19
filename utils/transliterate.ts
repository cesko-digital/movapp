import { ua2cz } from 'data/transliterations/ua2cz';
import { cz2ua } from './../data/transliterations/cz2ua';

const removePunctuation = (str: string) => str.replace('.', '').replace('?', '').replace('!', '');

export const translit = (subs: [string, string][], text: string) => {
  let result = text;
  for (let i = 0; i < subs.length; i++) {
    // Vercel's Node 14 does not support String.replaceAll(), so we must use a RegEx workaround
    result = result.replace(new RegExp(subs[i][0], 'g'), subs[i][1]);
  }
  return removePunctuation(result);
};

export const translitFromUkrainian = (text: string) => translit(ua2cz, text);
export const translitToUkrainian = (text: string) => translit(cz2ua, text);
