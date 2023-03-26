import { fetchRawDictionary, DictionaryDataObject, Phrase, CategoryDataObject } from 'utils/getDataUtils';
import { getCountryVariant, Language } from 'utils/locales';
import { AudioPlayer } from 'utils/AudioPlayer';
import { create } from 'zustand';
import * as R from 'ramda';
import { createFactoryOfExerciseIdentification, ExerciseIdentificationOptions } from './ExerciseIdentification';

/* eslint-disable no-console */

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
  categories: CategoryDataObject['id'][] | null;
  history: Exercise[];
  exercise: Exercise | null;
}

export interface ExerciseStoreActions {
  init: () => void;
  start: () => void;
  home: () => void;
  setCategories: (categories: ExerciseStoreState['categories']) => void;
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
  //setExercise: (setFunc: (prevExercise: Exercise | null) => Exercise) => void;
  //setExerciseResult: (result: Exercise['result']) => void;
  exerciseResolved: () => void;
  exerciseCompleted: () => void;
  nextExercise: () => void;
  phraseFilters: Record<string, (phrase: Phrase) => boolean>;
  resolveMethods: Record<string, (exercise: Exercise) => boolean>;
  resultMethods: Record<string, (exercise: Exercise) => ExerciseResult>;
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

  // const setExerciseResult: ExerciseStoreUtils['setExerciseResult'] = (result) => {
  //   set(R.over(R.lensPath(['exercise', 'result']), () => result));
  // };

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
    const categories = get().categories;
    if (categories === null) throw Error('categories property is null');
    const phrases = getPhrases(get().dictionary as DictionaryDataObject, categories);
    const exercise = createNextExercise(phrases);
    set({ exercise });
  };

  // const setExercise: ExerciseStoreUtils['setExercise'] = (func) => {
  //   set(R.over(R.lensPath(['exercise']), func));
  // };

  const getExercise: ExerciseStoreUtils['getExercise'] = () => {
    const exercise = get().exercise;
    if (exercise === null) throw Error('active exercise is null');
    return exercise;
  };

  const getPhrases = (dictionary: DictionaryDataObject, categories: CategoryDataObject['id'][]) =>
    // TODO: maybe cache results
    dictionary.categories
      .filter(({ id }) => categories.includes(id))
      .map(({ phrases }) => phrases)
      .flat()
      .map((phraseId) => new Phrase(dictionary.phrases[phraseId]));

  const getCurrentLanguage: ExerciseStoreUtils['getCurrentLanguage'] = () => get().lang.currentLanguage;
  const getOtherLanguage: ExerciseStoreUtils['getOtherLanguage'] = () => get().lang.otherLanguage;

  const phraseFilters: ExerciseStoreUtils['phraseFilters'] = {
    filterOneWordPhrase: (phrase: Phrase) =>
      phrase.getTranslation(getCurrentLanguage()).split(' ').length + phrase.getTranslation(getOtherLanguage()).split(' ').length === 2,
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

  const createNextExercise = (phrases: Phrase[]) => {
    // TODO: implement logic to set exercise type and level
    //Parameters<typeof createExercise>[0]
    const exerciseType: Parameters<typeof createExercise>[0] = Math.random() > 0.5 ? 'textIdentification' : 'audioIdentification';
    return createExercise(exerciseType, { level: 0 })(phrases);
  };

  return {
    size: 3,
    level: 0,
    status: ExerciseStoreStatus.uninitialized,
    lang: { currentLanguage: getCountryVariant(), otherLanguage: 'uk' },
    dictionary: null,
    categories: null,
    history: [],
    exercise: null,
    init: async () => {
      // fetch dictionary
      const dictionary = await fetchRawDictionary();
      set({
        status: ExerciseStoreStatus.initialized,
        dictionary,
      });
    },
    start: () => {
      if (get().status === ExerciseStoreStatus.uninitialized) return;
      const dictionary = get().dictionary;
      if (dictionary === null) throw Error(`Dictionary isn't loaded.`);
      // get category phrasesData
      let categories = get().categories;
      if (categories === null) {
        // categories fallback
        categories = [dictionary.categories[0].id];
      }
      const phrases = getPhrases(dictionary, categories);
      // build exercise
      const exercise = createNextExercise(phrases);
      set({
        status: ExerciseStoreStatus.active,
        exercise,
      });
    },
    home: () => {
      set({
        exercise: null,
        history: [],
        status: ExerciseStoreStatus.initialized,
      });
    },
    setLang: (lang) => set({ lang }),
    setCategories: (categories) => set({ categories }),
    setSize: (size) => set({ size }),
    setLevel: (/*level*/) => set({ level: 0 }), // TODO: implement level setting, it stays 0 for now
  };
});

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
export const playAudio = (url: string) => AudioPlayer.getInstance().playSrc(url);
export const playAudioSlow = (url: string) => AudioPlayer.getInstance().playSrc(url, 0.5);
