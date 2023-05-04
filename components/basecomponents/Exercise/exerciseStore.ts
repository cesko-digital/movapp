import { fetchRawDictionary, DictionaryDataObject, Phrase, CategoryDataObject } from 'utils/getDataUtils';
import { getCountryVariant, Language } from 'utils/locales';
import { AudioPlayer } from 'utils/AudioPlayer';
import { create } from 'zustand';
import * as R from 'ramda';
import {
  createFactoryOfExerciseIdentification,
  ExerciseIdentificationOptions,
  isExerciseAudioIdentification,
  isExerciseTextIdentification,
} from './ExerciseIdentification';
import { Curry } from 'Function/_api';
import { sortRandom, getRandomItem } from 'utils/collectionUtils';

/* eslint-disable no-console */

const CONFIG_BASE = Object.freeze({
  sizeDefault: 3,
  sizeMin: 3,
  sizeMax: 10,
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

export enum ExerciseStatus {
  active = 'active',
  resolved = 'resolved',
  completed = 'completed',
}

export enum ExerciseType {
  identification = 'identification',
  // TODO: add other types of exercises
}

interface WithId {
  id: number;
}

const hasSameId = R.curry((id: WithId['id'], obj: WithId) => id === obj['id']);

export interface Choice extends WithId {
  select: () => void;
  selected: boolean;
  correct: boolean;
}

export interface ExerciseResult {
  score: number;
}

export interface Exercise extends WithId {
  type: ExerciseType;
  status: ExerciseStatus;
  choices: Choice[];
  level: number;
  resolve: () => boolean;
  getResult: () => ExerciseResult;
  completed: () => void;
  next: () => void;
}

export enum ExerciseStoreStatus {
  uninitialized = 'uninitialized',
  initialized = 'initialized',
  active = 'active',
  completed = 'completed',
}

export interface ExerciseStoreState {
  size: number;
  level: number;
  status: ExerciseStoreStatus;
  lang: { currentLanguage: Language; otherLanguage: Language };
  dictionary: DictionaryDataObject | null;
  categories: CategoryDataObject['id'][];
  history: Exercise[];
  exercise: Exercise | null;
  counter: number;
}

export interface ExerciseStoreActions {
  init: (quickStart?: boolean) => void;
  cleanUp: () => void;
  start: () => void;
  restart: () => void;
  home: () => void;
  nextExercise: () => void;
  setCategories: (categories: ExerciseStoreState['categories']) => void;
  getCategoryNames: () => { id: CategoryDataObject['id']; name: CategoryDataObject['name']['main'] }[];
  getMetacategoryNames: () => { id: CategoryDataObject['id']; name: CategoryDataObject['name']['main'] }[];
  setLang: (lang: ExerciseStoreState['lang']) => void;
  setSize: (size: ExerciseStoreState['size']) => void;
  setLevel: (size: ExerciseStoreState['level']) => void;
}

export interface ExerciseStoreUtils {
  uniqId: () => WithId['id'];
  selectChoice: (choiceId: Choice['id'], enableDeselect?: boolean) => void;
  getCurrentLanguage: () => Language;
  getOtherLanguage: () => Language;
  getExercise: () => Exercise;
  exerciseResolved: () => void;
  exerciseCompleted: () => void;
  nextExercise: ExerciseStoreActions['nextExercise'];
  phraseFilters: {
    wordLimit: (min: number, max: number) => (phrase: Phrase) => boolean;
    wordLimitForLevel: ((phrase: Phrase) => boolean)[];
    equalPhrase: Curry<(phraseA: Phrase, phraseB: Phrase) => boolean>; //(phraseA: Phrase, phraseB: Phrase) => boolean;
    greatPhraseFilter: (
      level: Exercise['level'],
      phrases: Phrase[],
      fallbackPhrases: Phrase[],
      config: { wordLimitMin: number; wordLimitMax: number; choiceLimit: number; levelMin: number }
    ) => Phrase[];
  };
  resolveMethods: Record<string, (exercise: Exercise) => boolean>;
  resultMethods: Record<string, (exercise: Exercise) => ExerciseResult>;
  getFallbackPhrases: () => Phrase[];
}

/** Describes complete state of the app, enables to save/restore app state */
export const useExerciseStore = create<ExerciseStoreState & ExerciseStoreActions>((set, get) => {
  const uniqId = ((): ExerciseStoreUtils['uniqId'] => {
    let id = 0;
    return () => {
      const out = id;
      id = id + 1;
      return out;
    };
  })();

  const selectChoice: ExerciseStoreUtils['selectChoice'] = (choiceId, enableDeselect = false) => {
    const exercise = getExercise();
    const choiceIndex = exercise.choices.findIndex(hasSameId(choiceId));
    if (choiceIndex === -1) throw Error(`choice id ${choiceId} not found in  exercise`);
    if (!enableDeselect && exercise.choices[choiceIndex].selected) {
      console.log(`choice ${choiceId} already selected`);
      return;
    }
    set(R.over(R.lensPath(['exercise', 'choices', choiceIndex, 'selected']), (val) => !val));
    console.log(`selected choice ${choiceId} in exercise`);
  };

  const exerciseResolved: ExerciseStoreUtils['exerciseResolved'] = () => {
    if (getExercise().status !== ExerciseStatus.active) throw Error('invalid exercise status');
    // if (getExercise().result === null) throw Error('exercise result is empty');
    set(R.over(R.lensPath(['exercise', 'status']), () => ExerciseStatus.resolved));
  };

  const exerciseCompleted: ExerciseStoreUtils['exerciseCompleted'] = () => {
    if (getExercise().status !== ExerciseStatus.resolved) throw Error('invalid exercise status');
    console.log(`exercise completed`);

    /* set exercise status completed and save exercise */
    set(R.over(R.lensPath(['exercise', 'status']), () => ExerciseStatus.completed));
    set((state) => ({
      history: [...state.history, getExercise()],
    }));
  };

  const nextExercise = () => {
    if (getExercise().status !== ExerciseStatus.completed) throw Error('invalid exercise status');
    if (get().status === ExerciseStoreStatus.completed) throw Error('invalid store status');

    /* check if session is completed */
    if (get().history.length === get().size) {
      console.log(`congrats all exercises completed...`);
      console.log(get().history);
      set({ status: ExerciseStoreStatus.completed });
      return;
    }

    console.log(`generating new exercise for you...`);
    set((state) => ({ exercise: createNextExercise(), counter: state.counter + 1 }));
  };

  const getExercise: ExerciseStoreUtils['getExercise'] = () => {
    const exercise = get().exercise;
    if (exercise === null) throw Error('active exercise is null');
    return exercise;
  };

  const getDictionary = () => {
    const dictionary = get().dictionary;
    if (dictionary === null) throw Error(`Dictionary isn't loaded.`);
    return dictionary;
  };

  const getPhrases = (dictionary: DictionaryDataObject, categories: CategoryDataObject['id'][]) =>
    // TODO: maybe cache results
    dictionary.categories
      .filter(({ id }) => categories.includes(id))
      .filter(({ phrases }) => phrases.length > 0)
      .map(({ phrases }) => phrases)
      .flat()
      .map((phraseId) => new Phrase(dictionary.phrases[phraseId]));

  // const getCategoryPhrases = (dictionary: DictionaryDataObject, categoryId: CategoryDataObject['id']) =>
  //   dictionary.categories
  //     .filter(({ id }) => categoryId === id)
  //     .map(({ phrases }) => phrases)
  //     .flat()
  //     .map((phraseId) => new Phrase(dictionary.phrases[phraseId]));

  const getFallbackPhrases = () => {
    const dictionary = getDictionary();
    // categories fallback
    const categories = [dictionary.categories[0].id];
    const phrases = getPhrases(dictionary, categories);
    return phrases;
  };

  const getCategoryNames = () => {
    const dictionary = getDictionary();
    return dictionary.categories
      .filter((category) => !category.hidden)
      .map((category) => ({ id: category.id, name: getCurrentLanguage() === 'uk' ? category.name.source : category.name.main }));
  };

  const getMetacategoryNames = () =>
    getDictionary()
      .categories.filter((category) => !category.hidden)
      .filter(({ metacategories }) => metacategories.length > 0)
      .map((category) => ({ id: category.id, name: getCurrentLanguage() === 'uk' ? category.name.source : category.name.main }));

  const getCurrentLanguage: ExerciseStoreUtils['getCurrentLanguage'] = () => get().lang.currentLanguage;
  const getOtherLanguage: ExerciseStoreUtils['getOtherLanguage'] = () => get().lang.otherLanguage;

  // TODO: clean up unused filter methods in future
  const wordLimit = (min: number, max: number) => (phrase: Phrase) =>
    passWordLimit(min, max, phrase.getTranslation(getCurrentLanguage())) &&
    passWordLimit(min, max, phrase.getTranslation(getOtherLanguage()));

  const passWordLimit = (min: number, max: number, phrase: string) => R.allPass([R.lte(min), R.gte(max)])(phrase.split(' ').length);

  // new better phrase filter :-)
  const greatPhraseFilter: ExerciseStoreUtils['phraseFilters']['greatPhraseFilter'] = (level, phrases, fallbackPhrases, config) => {
    // first it gets random number from range and then accept phrases that have this number of words (in current language)
    const range = config.wordLimitMax - config.wordLimitMin;
    // create Array of filters for all numbers in range
    const filters: ((phrase: Phrase) => boolean)[] = Array(range + 1)
      .fill(0)
      .map((e, i) => i + config.wordLimitMin)
      .map((e) => (phrase: Phrase) => phrase.getTranslation(getCurrentLanguage()).split(' ').length === e)
      // shuffle filters
      .sort(sortRandom);

    const filterPhrases = (filters: ((phrase: Phrase) => boolean)[], phrases: Phrase[]) =>
      filters
        .map((filter) =>
          phrases
            .filter(filter)
            .sort(sortRandom)
            // remove duplicates
            .filter((phrase, index, array) => array.findIndex(phraseFilters.equalPhrase(phrase)) === index)
        )
        .flat();

    let filteredPhrases = filterPhrases(filters, phrases);

    // if it fails then lower level
    if (filteredPhrases.length < config.choiceLimit) {
      // can't lower the level anymore
      if (level === CONFIG_BASE.levelMin) {
        // add fallback phrases
        console.warn('using fallback Phrases');
        const filteredFallbackPhrases = filterPhrases(filters, fallbackPhrases);
        filteredPhrases = [...filteredPhrases, ...filteredFallbackPhrases];
        if (filteredPhrases.length < config.choiceLimit) throw Error('Insuficient phrases to construct the Exercise');
      } else {
        // add phrases from lower level
        filteredPhrases = [
          ...filteredPhrases,
          ...greatPhraseFilter(Math.max(config.levelMin, level - 1), phrases, fallbackPhrases, {
            ...CONFIG[level - 1],
            choiceLimit: config.choiceLimit,
          }),
        ];
      }
    }

    // if it fails than tear your hair
    if (filteredPhrases.length < config.choiceLimit) throw Error('Insuficient phrases to construct the Exercise');

    return filteredPhrases.slice(0, config.choiceLimit).sort(sortRandom);
  };

  const phraseFilters: ExerciseStoreUtils['phraseFilters'] = {
    wordLimit,
    wordLimitForLevel: CONFIG.map((conf) => wordLimit(conf.wordLimitMin, conf.wordLimitMax)),
    equalPhrase: R.curry((a, b) => a.getTranslation().toLocaleLowerCase() === b.getTranslation().toLocaleLowerCase()),
    greatPhraseFilter,
  };

  const resolveMethods: ExerciseStoreUtils['resolveMethods'] = {
    anySelected: (exercise: Exercise) => !!exercise.choices.find((choice) => choice.selected),
    oneCorrect: (exercise: Exercise) => !!exercise.choices.find((choice) => choice.correct)?.selected,
    allCorrect: (exercise: Exercise) => exercise.choices.every((choice) => choice.selected && choice.correct),
  };

  const isCorrect = (obj: { correct: boolean }) => obj.correct;
  const isSelected = (obj: { selected: boolean }) => obj.selected;

  const resultMethods: ExerciseStoreUtils['resultMethods'] = {
    selectedCorrect: (exercise: Exercise) => ({
      // (Math.max(0,selected correct - selected wrong) / all correct) * 100
      score:
        (100 *
          Math.max(
            0,
            exercise.choices.filter(R.allPass([isCorrect, isSelected])).length -
              exercise.choices.filter(R.allPass([R.complement(isCorrect), isSelected])).length
          )) /
        exercise.choices.filter(isCorrect).length,
    }),
  };

  const utils: ExerciseStoreUtils = {
    uniqId,
    getCurrentLanguage,
    getOtherLanguage,
    selectChoice,
    getExercise,
    // setExerciseResult,
    //setExercise,
    exerciseResolved,
    exerciseCompleted,
    nextExercise,
    phraseFilters,
    resolveMethods,
    resultMethods,
    getFallbackPhrases,
  };

  const createExercise = (
    type: 'audioIdentification' | 'textIdentification',
    options: ExerciseIdentificationOptions
  ): ((phrases: Phrase[]) => Exercise) => {
    const list = {
      audioIdentification: createFactoryOfExerciseIdentification(utils, { ...options, mode: 'audio' }),
      textIdentification: createFactoryOfExerciseIdentification(utils, { ...options, mode: 'text' }),
      // TODO: add other types of exercises
    };
    return list[type];
  };

  const createNextExercise = () => {
    const dictionary = getDictionary();
    // get category phrasesData
    const categories = get().categories;
    if (categories.length === 0) {
      throw Error('None categories selected.');
      // categories fallback
      // categories = [dictionary.categories[0].id];
    }

    const processedCategories = categories
      .map((categoryId) => {
        const category = dictionary.categories.find(({ id }) => categoryId === id);
        if (category === undefined) throw Error(`Can't find category with id ${categoryId}`);
        // not a metacategory
        if (category.metacategories.length === 0) return [categoryId];

        return (
          dictionary.categories
            .filter(({ id }) => category.metacategories.includes(id))
            // omit categories without phrases
            .filter(({ phrases }) => phrases.length > 0)
            // need only ids
            .map(({ id }) => id)
        );
      })
      .flat();

    // considering to not mix up categories for current exercise, so pick only one from the list
    const phrases = getPhrases(dictionary, [getRandomItem(processedCategories)]);
    // mix categories together
    //const phrases = getPhrases(dictionary, categories);
    // build exercise

    // TODO: implement logic to set exercise type and level
    //Parameters<typeof createExercise>[0]
    const exerciseType: Parameters<typeof createExercise>[0] = Math.random() > 0.5 ? 'textIdentification' : 'audioIdentification';
    return createExercise(exerciseType, { level: computeLevelForNextExercise(exerciseType, get().history) })(phrases);
  };

  const exerciseFilter: Record<string, (ex: Exercise) => boolean> = {
    audioIdentification: isExerciseAudioIdentification,
    textIdentification: isExerciseTextIdentification,
  };

  const computeLevelForNextExercise = (exerciseType: Parameters<typeof createExercise>[0], history: Exercise[]) => {
    const exerciseList = history.filter(exerciseFilter[exerciseType]);
    if (exerciseList.length === 0) return get().level; // if has no exercise of same type return global level
    const exercise = exerciseList.slice(-1)[0];
    const score = exercise.getResult().score;
    if (score < CONFIG_BASE.levelDownTresholdScore) return Math.max(CONFIG_BASE.levelMin, exercise.level - 1);
    if (score > CONFIG_BASE.levelDownTresholdScore && score < CONFIG_BASE.levelUpTresholdScore) return exercise.level;
    return Math.min(CONFIG_BASE.levelMax, exercise.level + 1);
  };

  return {
    size: CONFIG_BASE.sizeDefault,
    level: CONFIG_BASE.levelDefault,
    status: ExerciseStoreStatus.uninitialized,
    lang: { currentLanguage: getCountryVariant(), otherLanguage: 'uk' },
    dictionary: null,
    categories: [],
    history: [],
    exercise: null,
    counter: 0,
    init: async (quickStart = false) => {
      const dictionary = await fetchRawDictionary();
      set({ dictionary });
      set({
        history: [],
        exercise: quickStart ? createNextExercise() : null,
        counter: quickStart ? 1 : 0,
        status: quickStart ? ExerciseStoreStatus.active : ExerciseStoreStatus.initialized,
      });
    },
    cleanUp: () => {
      set({
        status: ExerciseStoreStatus.uninitialized,
        categories: [],
      });
    },
    start: () => {
      if (get().status === ExerciseStoreStatus.uninitialized) return;
      set({
        status: ExerciseStoreStatus.active,
        exercise: createNextExercise(),
        counter: 1,
      });
    },
    home: () =>
      set({
        exercise: null,
        history: [],
        counter: 0,
        status: ExerciseStoreStatus.initialized,
        categories: [],
      }),
    restart: () =>
      set({
        history: [],
        counter: 1,
        status: ExerciseStoreStatus.active,
        exercise: createNextExercise(),
      }),
    nextExercise,
    setLang: (lang) => set({ lang }),
    setCategories: (categories) => set({ categories }),
    getCategoryNames,
    getMetacategoryNames,
    setSize: (size) => set({ size }),
    setLevel: (val) => set({ level: val }),
  };
});

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
export const playAudio = (url: string) => AudioPlayer.getInstance().playSrc(url);
export const playAudioSlow = (url: string) => AudioPlayer.getInstance().playSrc(url, 0.75);
