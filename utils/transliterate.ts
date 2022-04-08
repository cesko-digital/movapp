export const translit = (translitMap: [string, string][], translitStr: string) => {
  let transliterated = translitStr;
  for (let i = 0; i < translitMap.length; i++) {
    const reg = new RegExp(translitMap[i][0], 'g');
    transliterated = transliterated
      .replace(reg, translitMap[i][1])
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
  return transliterated;
};
