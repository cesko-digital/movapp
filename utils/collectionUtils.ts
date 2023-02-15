export const shuffle = <T>(array: T[] = [], size: number): T[] => {
  const arrayCopy = array.slice();
  let i = arrayCopy.length - 1;
  const min = i - size;
  for (; i > 0 && i > min; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy.slice(min + 1);
};

export const getRandomItem = <Type>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];
