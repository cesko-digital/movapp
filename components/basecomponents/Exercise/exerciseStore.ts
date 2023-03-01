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
  select: (effects: () => Promise<void>) => Promise<void>;
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
  resolve: () => Promise<void>;
}

export enum ExerciseStoreStatus {
  uninitialized = 'uninitialized',
  ready = 'ready',
  completed = 'completed',
}

interface ExerciseStoreState {
  status: ExerciseStoreStatus;
  lang: { currentLanguage: Language; otherLanguage: Language };
  dictionary: DictionaryDataObject | null;
  exerciseList: Exercise[];
  activeExerciseId: Exercise['id'] | null;
  controlsDisabled: boolean;
}

interface ExerciseStoreActions {
  init: (categories: CategoryDataObject['id'][]) => void;
  setLang: (lang: { currentLanguage: Language; otherLanguage: Language }) => void;
  getActiveExerciseIndex: () => number;
}

export interface ExerciseStoreUtils {
  uniqId: () => WithId['id'];
  selectChoice: (choiceId: Choice['id'], enableDeselect?: boolean) => void;
  getCurrentLanguage: () => Language;
  getOtherLanguage: () => Language;
  exerciseCompleted: (exerciseId: Exercise['id'], result: Exercise['result']) => Promise<void>;
  playAudio: (url: string) => Promise<void>;
  playAudioSlow: (url: string) => Promise<void>;
  delay: (ms: number) => Promise<void>;
  enableControls: () => void;
  disableControls: () => void;
  getControlsDisabled: () => boolean;
  getActiveExercise: () => Exercise;
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

  const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
  const playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);
  const playAudioSlow = (url: string) => {
    console.log(`playing slowly ${url}`);
    return playAudio(url);
  };

  const enableControls: ExerciseStoreUtils['enableControls'] = () => set({ controlsDisabled: true });
  const disableControls: ExerciseStoreUtils['disableControls'] = () => set({ controlsDisabled: false });
  const getControlsDisabled: ExerciseStoreUtils['getControlsDisabled'] = () => get().controlsDisabled;

  // ensures that store knows about state changes //
  const selectChoice: ExerciseStoreUtils['selectChoice'] = (choiceId, enableDeselect = false) => {
    // place to react on user input
    // place to handle user choice, disable buttons
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

  const exerciseCompleted: ExerciseStoreUtils['exerciseCompleted'] = async (exerciseId, result) => {
    // place to react on exercise completed
    console.log(`exercise ${exerciseId} completed`);
    //const exercise = getActiveExercise();
    // TODO: perform check if active exercise id match exerciseId
    if (getActiveExercise().id !== exerciseId) throw Error('exercise is does not match active exercise');
    // TODO: check if it is not completed

    /* set exercise status completed */
    set(R.over(R.lensPath(['exerciseList', getActiveExerciseIndex(), 'status']), () => ExerciseStatus.completed));
    /* set exercise result */
    set(R.over(R.lensPath(['exerciseList', getActiveExerciseIndex(), 'result']), () => result));
    console.log(result);
    await delay(1000);

    /* check all exercise are completed */
    if (get().exerciseList.every(({ status }) => status === ExerciseStatus.completed)) {
      console.log(`congrats all exercises completed...`);
      set({ status: ExerciseStoreStatus.completed });
      return;
      // show summary screen
    }

    /* generate/pick new exercise */
    console.log(`generating new exercise for you...`);

    set((state) => {
      const newExerciseIndex = state.exerciseList.findIndex(({ status }) => status === ExerciseStatus.queued);
      const updatedExerciseList = R.over(R.lensPath([newExerciseIndex, 'status']), () => ExerciseStatus.active, state.exerciseList);
      return {
        exerciseList: updatedExerciseList,
        exerciseIndex: newExerciseIndex,
      };
    });
  };

  const getActiveExerciseIndex = () => {
    const activeExerciseId = get().activeExerciseId;
    const index = get().exerciseList.findIndex(({ id }) => id === activeExerciseId);
    if (index === -1) throw Error(`id ${activeExerciseId} not found`);
    return index;
  };

  const getActiveExercise = () => get().exerciseList[getActiveExerciseIndex()];
  // const hasSameId = R.curry((id: WithId['id'], obj: WithId) => id === obj['id']);

  // choice id look up tested with 100 exercices and x6 CPU slowdown, it was OK, lightning fast
  //const findExercise = (exerciseId: number) => get().exerciseList.findIndex(({ id }) => id === exerciseId);
  // const findChoice = (choiceId: Choice['id']) => {
  //   const exercise = getActiveExercise();
  //   if (exercise === null) throw Error('exercise is null');
  //   const result = exercise.choices.find(hasSameId(choiceId));
  //   if (result === undefined) throw Error(`choice ${choiceId} not found`);
  //   return result;
  // };

  const getChoicePath = (choiceId: number) => {
    const exercise = getActiveExercise();
    if (exercise === null) throw Error('exercise is null');
    const choiceIndex = exercise.choices.findIndex(({ id }) => id === choiceId);
    return ['exerciseList', getActiveExerciseIndex(), 'choices', choiceIndex];
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
    exerciseCompleted,
    playAudio,
    playAudioSlow,
    delay,
    enableControls,
    disableControls,
    getControlsDisabled,
    getActiveExercise,
  };

  const createExercise: Record<ExerciseType, (phrases: Phrase[]) => Exercise> = {
    identification: createFactoryOfExerciseIdentification(utils),
  };

  return {
    status: ExerciseStoreStatus.uninitialized,
    lang: { currentLanguage: getCountryVariant(), otherLanguage: 'uk' },
    dictionary: null,
    exerciseList: [],
    activeExerciseId: null,
    controlsDisabled: true,
    init: async (categories) => {
      // fetch dictionary
      const dictionary = await fetchRawDictionary();
      // get category phrasesData
      const phrases = getPhrases(dictionary, categories);
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
        controlsDisabled: false,
      });
    },
    setLang: (lang) => set({ lang }),
    getActiveExerciseIndex,
  };
});
