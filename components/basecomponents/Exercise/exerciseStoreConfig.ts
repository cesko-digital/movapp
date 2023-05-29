export const CONFIG_BASE = Object.freeze({
  sizeDefault: 10,
  sizeList: [10, 20, 30],
  debugSizeList: [1, 5, 10],
  levelDefault: 0,
  levelMin: 0,
  levelMax: 1,
  levelDownTresholdScore: 50,
  levelUpTresholdScore: 100,
});

const CONFIG_LEVEL0 = Object.freeze({
  wordLimitMin: 1,
  wordLimitMax: 2,
  choiceLimit: 4,
});

const CONFIG_LEVEL1 = Object.freeze({
  wordLimitMin: 2,
  wordLimitMax: 3,
  choiceLimit: 5,
});

const CONFIG_LEVEL2 = Object.freeze({
  wordLimitMin: 2,
  wordLimitMax: 3,
  choiceLimit: 8,
});

export const CONFIG = Object.freeze([
  { ...CONFIG_BASE, ...CONFIG_LEVEL0 },
  { ...CONFIG_BASE, ...CONFIG_LEVEL0, ...CONFIG_LEVEL1 },
  { ...CONFIG_BASE, ...CONFIG_LEVEL0, ...CONFIG_LEVEL1, ...CONFIG_LEVEL2 },
]);
