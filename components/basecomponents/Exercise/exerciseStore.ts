import { fetchRawDictionary, DictionaryDataObject, Phrase, CategoryDataObject } from 'utils/getDataUtils';
import { getCountryVariant, Language } from 'utils/locales';
import { AudioPlayer } from 'utils/AudioPlayer';
import { create } from 'zustand';
import * as R from 'ramda';
import { createFactoryOfExerciseIdentification } from './ExerciseIdentification';

/* eslint-disable no-console */

export enum ExerciseStatus {
  queued = 'queued',
  active = 'active',
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
}

export enum ExerciseStoreStatus {
  uninitialized = 'uninitialized',
  ready = 'ready',
  completed = 'completed',
}

export interface ExerciseStoreState {
  status: ExerciseStoreStatus;
  lang: { currentLanguage: Language; otherLanguage: Language };
  dictionary: DictionaryDataObject | null;
  categories: CategoryDataObject['id'][];
  exerciseList: Exercise[];
  activeExerciseId: Exercise['id'] | null;
}

export interface ExerciseStoreActions {
  init: () => void;
  setCategories: (categories: ExerciseStoreState['categories']) => void;
  setLang: (lang: ExerciseStoreState['lang']) => void;
  getActiveExerciseIndex: () => number;
  nextExercise: () => void;
}

export interface ExerciseStoreUtils {
  uniqId: () => WithId['id'];
  selectChoice: (choiceId: Choice['id'], enableDeselect?: boolean) => void;
  getCurrentLanguage: () => Language;
  getOtherLanguage: () => Language;
  getActiveExercise: () => Exercise;
  getActiveExerciseAndIndex: () => [Exercise, number];
  getExercise: (exerciseId: Exercise['id']) => Exercise;
  saveExerciseResult: (exerciseId: Exercise['id'], result: Exercise['result']) => void;
  exerciseCompleted: (exerciseId: Exercise['id']) => void;
  nextExercise: ExerciseStoreActions['nextExercise'];
  setExerciseProp: <T extends keyof Exercise>(
    exerciseId: Exercise['id'],
    prop: T,
    func: (exerciseProp: Exercise[T]) => Exercise[T]
  ) => void;
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

  // ensures that store knows about state changes //
  const selectChoice: ExerciseStoreUtils['selectChoice'] = (choiceId, enableDeselect = false) => {
    // TODO: guard - select on active exercise only
    const choicePath = getChoicePath(choiceId);
    const choice = R.view(R.lensPath(choicePath), get());
    if (!enableDeselect && choice.selected) {
      console.log(`choice ${choiceId} already selected`);
      return;
    }
    // set choice selected
    set(R.over(R.lensPath([...choicePath, 'selected']), (val) => !val));
    console.log(`selected choice ${choiceId} in exercise`);
    console.log(get().exerciseList);
  };

  const exerciseCompleted: ExerciseStoreUtils['exerciseCompleted'] = (exerciseId) => {
    // place to react on exercise completed
    const [exercise, exerciseIndex] = getActiveExerciseAndIndex();
    console.log(`exercise ${exerciseId} completed with result ${exercise.result}`);
    if (exercise.id !== exerciseId) throw Error('exercise does not match active exercise');

    /* set exercise status completed */
    set(R.over(R.lensPath(['exerciseList', exerciseIndex, 'status']), () => ExerciseStatus.completed));

    /* check all exercise are completed */
    if (get().exerciseList.every(({ status }) => status === ExerciseStatus.completed)) {
      console.log(`congrats all exercises completed...`);
      set({ status: ExerciseStoreStatus.completed });
      return;
      // show summary screen
    }
  };

  const nextExercise = () => {
    /* generate/pick new exercise */
    console.log(`generating new exercise for you...`);
    // TODO: add guards
    set((state) => {
      const newExerciseIndex = state.exerciseList.findIndex(({ status }) => status === ExerciseStatus.queued);
      const newExerciseId = state.exerciseList[newExerciseIndex].id;
      const updatedExerciseList = R.over(R.lensPath([newExerciseIndex, 'status']), () => ExerciseStatus.active, state.exerciseList);

      return {
        exerciseList: updatedExerciseList,
        activeExerciseId: newExerciseId,
      };
    });
  };

  const saveExerciseResult: ExerciseStoreUtils['saveExerciseResult'] = (exerciseId, result) => {
    set(R.over(R.lensPath(['exerciseList', findExerciseIndex(exerciseId), 'result']), () => result));
  };

  const setExerciseProp: ExerciseStoreUtils['setExerciseProp'] = (exerciseId, prop, func) => {
    set(R.over(R.lensPath(['exerciseList', findExerciseIndex(exerciseId), prop]), func));
  };

  const getActiveExerciseIndex = () => {
    const activeExerciseId = get().activeExerciseId;
    if (activeExerciseId === null) throw Error('active exercise id is null');
    return findExerciseIndex(activeExerciseId);
  };

  const getActiveExerciseAndIndex: ExerciseStoreUtils['getActiveExerciseAndIndex'] = () => {
    const exerciseIndex = getActiveExerciseIndex();
    const exercise = get().exerciseList[exerciseIndex];
    if (exercise === null) throw Error('active exercise is null');
    return [exercise, exerciseIndex];
  };

  const getActiveExercise: ExerciseStoreUtils['getActiveExercise'] = () => getActiveExerciseAndIndex()[0];

  const hasSameId = R.curry((id: WithId['id'], obj: WithId) => id === obj['id']);

  // choice id look up tested with 100 exercices and x6 CPU slowdown, it was OK, lightning fast
  const findExerciseIndex = (exerciseId: number) => {
    const index = get().exerciseList.findIndex(hasSameId(exerciseId));
    if (index === -1) throw Error(`exercise id ${exerciseId} not found`);
    return index;
  };

  const getExercise: ExerciseStoreUtils['getExercise'] = (exerciseId: number) => get().exerciseList[findExerciseIndex(exerciseId)];

  const getChoicePath = (choiceId: number) => {
    const [exercise, exerciseIndex] = getActiveExerciseAndIndex();
    const choiceIndex = exercise.choices.findIndex(hasSameId(choiceId));
    if (choiceIndex === -1) throw Error(`choice id ${choiceId} not found in active exercise`);
    return ['exerciseList', exerciseIndex, 'choices', choiceIndex];
  };

  const getPhrases = (dictionary: DictionaryDataObject, categories: CategoryDataObject['id'][]) =>
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
    getActiveExercise,
    getActiveExerciseAndIndex,
    getExercise,
    saveExerciseResult,
    setExerciseProp,
    exerciseCompleted,
    nextExercise,
  };

  const createExercise: Record<ExerciseType, (phrases: Phrase[]) => Exercise> = {
    identification: createFactoryOfExerciseIdentification(utils),
  };

  return {
    status: ExerciseStoreStatus.uninitialized,
    lang: { currentLanguage: getCountryVariant(), otherLanguage: 'uk' },
    dictionary: null,
    categories: ['recdabyHkJhGf7U5D'],
    exerciseList: [],
    activeExerciseId: null,
    init: async () => {
      // fetch dictionary
      const dictionary = await fetchRawDictionary();
      // get category phrasesData
      const phrases = getPhrases(dictionary, get().categories);
      // build exercise /// exercise list, list will include more types of exercises in future
      const exerciseList = Array(3)
        .fill(0)
        .map(() => createExercise[ExerciseType.identification](phrases));
      exerciseList[0].status = ExerciseStatus.active;
      set({
        status: ExerciseStoreStatus.ready,
        dictionary,
        activeExerciseId: exerciseList[0].id,
        exerciseList,
      });
    },
    setLang: (lang) => set({ lang }),
    setCategories: (categories) => set({ categories }),
    getActiveExerciseIndex,
    nextExercise,
  };
});

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
export const playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);
export const playAudioSlow = (url: string) => {
  console.log(`playing slowly ${url}`);
  return playAudio(url);
};
