import { fetchRawDictionary, DictionaryDataObject, Phrase, CategoryDataObject } from 'utils/getDataUtils';
import { getCountryVariant, Language } from 'utils/locales';
import { AudioPlayer } from 'utils/AudioPlayer';
import { create } from 'zustand';
import * as R from 'ramda';
import { createFactoryOfExerciseIdentification } from './ExerciseIdentification';

/* eslint-disable no-console */

export enum ExerciseStatus {
  active = 'active',
  resolved = 'resolved',
  completed = 'completed',
}

export enum ExerciseType {
  identification = 'identification',
}

interface WithId {
  id: number;
}

export interface Choice extends WithId {
  select: () => void;
  selected: boolean;
  correct: boolean;
  //[propName: string]: any; // optional properties
}

export interface Exercise extends WithId {
  type: ExerciseType;
  status: ExerciseStatus;
  choices: Choice[];
  result: string;
  level: number;
  resolve: () => boolean;
  completed: () => void;
  next: () => void;
  export: () => string; // TODO: implement export interface
}

export enum ExerciseStoreStatus {
  uninitialized = 'uninitialized',
  ready = 'ready',
  completed = 'completed',
}

export interface ExerciseStoreState {
  size: number;
  status: ExerciseStoreStatus;
  lang: { currentLanguage: Language; otherLanguage: Language };
  dictionary: DictionaryDataObject | null;
  categories: CategoryDataObject['id'][];
  history: string[]; // TODO: implement how to store exercises
  exercise: Exercise | null;
}

export interface ExerciseStoreActions {
  init: () => void;
  setCategories: (categories: ExerciseStoreState['categories']) => void;
  setLang: (lang: ExerciseStoreState['lang']) => void;
  nextExercise: () => void;
}

export interface ExerciseStoreUtils {
  uniqId: () => WithId['id'];
  selectChoice: (choiceId: Choice['id'], enableDeselect?: boolean) => void;
  getCurrentLanguage: () => Language;
  getOtherLanguage: () => Language;
  getExercise: () => Exercise;
  setExercise: (setFunc: (prevExercise: Exercise | null) => Exercise) => void;
  setExerciseResult: (result: Exercise['result']) => void;
  exerciseCompleted: () => void;
  nextExercise: ExerciseStoreActions['nextExercise'];
  //setExerciseProp: <T extends keyof Exercise>(prop: T, func: (exerciseProp: Exercise[T]) => Exercise[T]) => void;
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
    // set choice selected
    set(R.over(R.lensPath(['exercise', 'choices', choiceIndex, 'selected']), (val) => !val));
    console.log(`selected choice ${choiceId} in exercise`);
  };

  const exerciseCompleted: ExerciseStoreUtils['exerciseCompleted'] = () => {
    // TODO: guards: exercise isn't completed but it's resolved
    console.log(`exercise completed`);

    /* set exercise status completed and save exercise*/
    set(R.over(R.lensPath(['exercise', 'status']), () => ExerciseStatus.completed));
    set((state) => ({
      history: [...state.history, getExercise().export()],
    }));

    /* check if session is completed */
    if (get().history.length === get().size) {
      console.log(`congrats all exercises completed...`);
      set({ status: ExerciseStoreStatus.completed });
    }
  };

  const nextExercise = () => {
    // TODO: guards: exercise is completed, session isn't over
    /* generate new exercise */
    console.log(`generating new exercise for you...`);
    const phrases = getPhrases(get().dictionary as DictionaryDataObject, get().categories);
    const exercise = createExercise[ExerciseType.identification](phrases);
    set({ exercise });
  };

  const setExerciseResult: ExerciseStoreUtils['setExerciseResult'] = (result) => {
    // TODO: guards: exercise is active and not resolved
    set(R.over(R.lensPath(['exercise', 'result']), () => result));
    set(R.over(R.lensPath(['exercise', 'status']), () => ExerciseStatus.resolved));
  };

  const setExercise: ExerciseStoreUtils['setExercise'] = (func) => {
    set(R.over(R.lensPath(['exercise']), func));
  };

  const hasSameId = R.curry((id: WithId['id'], obj: WithId) => id === obj['id']);

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

  const utils: ExerciseStoreUtils = {
    uniqId,
    getCurrentLanguage,
    getOtherLanguage,
    selectChoice,
    getExercise,
    setExerciseResult: setExerciseResult,
    setExercise,
    exerciseCompleted,
    nextExercise,
  };

  const createExercise: Record<ExerciseType, (phrases: Phrase[]) => Exercise> = {
    identification: createFactoryOfExerciseIdentification(utils),
  };

  return {
    size: 3,
    status: ExerciseStoreStatus.uninitialized,
    lang: { currentLanguage: getCountryVariant(), otherLanguage: 'uk' },
    dictionary: null,
    categories: ['recdabyHkJhGf7U5D'], // category: basic
    history: [],
    exercise: null,
    init: async () => {
      // fetch dictionary
      const dictionary = await fetchRawDictionary();
      // get category phrasesData
      const phrases = getPhrases(dictionary, get().categories);
      // build exercise
      const exercise = createExercise[ExerciseType.identification](phrases);
      set({
        status: ExerciseStoreStatus.ready,
        dictionary,
        exercise,
      });
    },
    setLang: (lang) => set({ lang }),
    setCategories: (categories) => set({ categories }),
    nextExercise,
  };
});

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
export const playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);
export const playAudioSlow = (url: string) => {
  console.log(`playing slowly ${url}`);
  // TODO: implement play slow: maybe create a new method or add optional parameter to playSrc() in AudioPlayer.ts
  return playAudio(url);
};
