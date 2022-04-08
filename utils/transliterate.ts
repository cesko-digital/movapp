export const translit = (translitMap: [string, string][], translitStr: string) => {
  let transliterated = translitStr;
  for (let i = 0; i < translitMap.length; i++) {
    transliterated = transliterated.replaceAll(translitMap[i][0], translitMap[i][1]);
  }
  return transliterated;
};
