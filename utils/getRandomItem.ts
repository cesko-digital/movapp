const getRandomItem = <Type>(arr: Type[]): Type => arr[Math.floor(Math.random() * arr.length)];
export default getRandomItem;
