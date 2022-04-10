import { ua2cz } from 'data/transliterations/ua2cz';
import { cz2ua } from './../data/transliterations/cz2ua';
export const translit = (subs: [string, string][], text: string) => {
  console.log(text);
  let result = text;
  for (let i = 0; i < subs.length; i++) {
    result = result.replaceAll(subs[i][0], subs[i][1]);
  }
  return result.replaceAll('.', '').replaceAll('?', '').replaceAll('!', '');
};

export const translitFromUkrainian = (text: string) => translit(ua2cz, text);
export const translitToUkrainian = (text: string) => translit(cz2ua, text);
