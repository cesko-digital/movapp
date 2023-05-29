import { fetchRawDictionary, DictionaryDataObject, Phrase, CategoryDataObject } from 'utils/getDataUtils';
import { getCountryVariant, Language } from 'utils/locales';
import { create } from 'zustand';
import { createExercise } from './createExercise';
import { getRandomItem } from 'utils/collectionUtils';
import * as R from 'ramda';
import { CONFIG_BASE } from './exerciseStoreConfig';

/* eslint-disable no-console */

export enum ExerciseStatus {
  active = 'active',
  completed = 'completed',
}

export enum ExerciseType {
  textIdentification = 'textIdentification',
  audioIdentification = 'audioIdentification',
}

interface WithId {
  id: number;
}

export const findById = <T>(idToSearch: number, obj: (WithId & T)[]): T => {
  const result = obj.find(({ id }) => id === idToSearch);
  if (result === undefined) throw Error(`item with id ${idToSearch} doesn't exists`);
  return result;
};

export interface Choice extends WithId {
  phrase: Phrase;
}

export interface ExerciseResult {
  score: number;
}

export interface Exercise extends WithId {
  type: ExerciseType;
  status: ExerciseStatus;
  choices: Choice[];
  correctChoiceId: number;
  level: number;
  result: ExerciseResult | null;
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
  exerciseCompleted: (result: ExerciseResult) => void;
  setCategories: (categories: ExerciseStoreState['categories']) => void;
  setLang: (lang: ExerciseStoreState['lang']) => void;
  setSize: (size: ExerciseStoreState['size']) => void;
  setLevel: (size: ExerciseStoreState['level']) => void;
  uniqId: () => WithId['id'];
}

export interface ExerciseStoreUtils {
  uniqId: () => number;
  getCurrentLanguage: () => Language;
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

  const exerciseCompleted: ExerciseStoreActions['exerciseCompleted'] = (result: ExerciseResult) => {
    const exercise = getExercise();
    if (exercise.status === ExerciseStatus.completed) throw Error('invalid exercise status');
    console.log(`exercise completed`);
    /* set exercise status completed and save exercise */
    set({ exercise: { ...exercise, result } });
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

  const getExercise = () => {
    const exercise = get().exercise;
    if (exercise === null) throw Error('active exercise is null');
    return exercise;
  };

  const getDictionary = () => {
    const dictionary = get().dictionary;
    if (dictionary === null) throw Error(`Dictionary isn't loaded.`);
    return dictionary;
  };

  const getPhrases = (dictionary: DictionaryDataObject, categories: CategoryDataObject['id'][]) => {
    const regex = /[\(,\/]/; // filter phrases containing ( or /
    return (
      dictionary.categories
        .filter(({ id }) => categories.includes(id))
        .filter(({ phrases }) => phrases.length > 0)
        .map(({ phrases }) => phrases)
        .flat()
        // create phrases
        .map((phraseId) => new Phrase(dictionary.phrases[phraseId]))
        // filter phrases
        .filter(
          (phrase) =>
            phrase.getTranslation(getCurrentLanguage()).match(regex) === null &&
            phrase.getTranslation(getOtherLanguage()).match(regex) === null
        )
    );
  };

  const getFallbackPhrases = () => {
    const dictionary = getDictionary();
    // categories fallback
    const categories = [dictionary.categories[0].id];
    const phrases = getPhrases(dictionary, categories);
    return phrases;
  };

  const getCurrentLanguage = () => get().lang.currentLanguage;
  const getOtherLanguage = () => get().lang.otherLanguage;

  const utils: ExerciseStoreUtils = {
    uniqId,
    getCurrentLanguage,
    getFallbackPhrases,
  };

  const createNextExercise = () => {
    const dictionary = getDictionary();
    // get category phrasesData
    const categories = get().categories;
    if (categories.length === 0) {
      throw Error('None categories selected.');
    }

    // considering to not mix up categories for current exercise, so pick only one from the list
    const phrases = getPhrases(dictionary, [getRandomItem(categories)]);
    // mix categories together
    //const phrases = getPhrases(dictionary, categories);

    const exerciseType = Math.random() > 0.5 ? ExerciseType.textIdentification : ExerciseType.audioIdentification;
    return createExercise(utils, exerciseType, { level: computeLevelForNextExercise(exerciseType, get().history) })(phrases);
  };

  const computeLevelForNextExercise = (exerciseType: ExerciseType, history: Exercise[]) => {
    // const exerciseList = history.filter(exerciseFilter[exerciseType]);
    const exerciseList = history.filter(({ type }) => type === exerciseType);
    if (exerciseList.length === 0) return get().level; // if has no exercise of same type return global level
    const exercise = exerciseList.slice(-1)[0];
    if (exercise.result === null) throw Error('result is unexpectedly null');
    const score = exercise.result.score;
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
      if (get().dictionary === null) set({ dictionary: await fetchRawDictionary() });
      set({
        history: [],
        exercise: null,
        counter: 0,
        status: ExerciseStoreStatus.initialized,
      });
      if (quickStart === true) get().start();
    },
    cleanUp: () => {
      set({
        status: ExerciseStoreStatus.uninitialized,
        categories: [],
        exercise: null,
        history: [],
        counter: 0,
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
    exerciseCompleted,
    setLang: (lang) => set({ lang }),
    setCategories: (categories) => set({ categories }),
    setSize: (size) => set({ size }),
    setLevel: (val) => set({ level: val }),
    uniqId,
  };
});
