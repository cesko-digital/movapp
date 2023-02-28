import { fetchRawDictionary, DictionaryDataObject, Phrase } from 'utils/getDataUtils';
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
  failed = 'failed',
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
  resolve: (exercise: Exercise) => boolean; // how to resolve exercise is concern of Exercise
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
  exerciseIndex: number;
}

interface ExerciseStoreActions {
  init: () => void;
  setLang: (lang: { currentLanguage: Language; otherLanguage: Language }) => void;
}

export interface ExerciseStoreUtils {
  uniqId: () => WithId['id'];
  selectChoice: (choiceId: Choice['id'], enableDeselect?: boolean) => void;
  getCurrentLanguage: () => Language;
  getOtherLanguage: () => Language;
  resolveExercise: (exerciseId: Exercise['id']) => Promise<void>;
  playAudio: (url: string) => Promise<void>;
  playAudioSlow: (url: string) => Promise<void>;
  delay: (ms: number) => Promise<void>;
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
    // plays audio
    // store handles audio play = better control
    console.log(`playing ${url}`);
    return playAudio(url);
  };

  // ensures that store knows about state changes //
  const selectChoice: ExerciseStoreUtils['selectChoice'] = (choiceId, enableDeselect = false) => {
    // place to react on user input
    // place to handle user choice, disable buttons, animate exercise stuff
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

  const resolveExercise: ExerciseStoreUtils['resolveExercise'] = async (exerciseId) => {
    // place to react on exercise resolve
    // resolves exercise and take next action
    console.log(`resolving active exercise ${exerciseId}`);
    const exercise = getActiveExercise();
    // TODO: perform check if active exercise id match exerciseId
    // TODO: check if it is not completed
    if (exercise.resolve(exercise)) {
      /* set exercise status completed */
      set(R.over(R.lensPath(['exerciseList', get().exerciseIndex, 'status']), () => ExerciseStatus.completed));
      console.log(`exercise completed hooray...`);
      await delay(1000);

      /* check if all exercise are completed or failed maybe ...*/
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
      }); // by docs updates should be merged automaticaly, but we can do it at once
    } else {
      /* notify user that it's not completed */
      console.log(`try again...`);
    }
  };

  const getActiveExercise = () => get().exerciseList[get().exerciseIndex];
  // const hasSameId = R.curry((id: WithId['id'], obj: WithId) => id === obj['id']);

  // choice id look up tested with 100 exercices and x6 CPU slowdown, it was OK, lightning fast
  // const findExercise = (exerciseId: number) => get().exercises.findIndex(({id}) => id === exerciseId);
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
    // const exerciseIndex = 0;
    const choiceIndex = exercise.choices.findIndex(({ id }) => id === choiceId);
    return ['exerciseList', get().exerciseIndex, 'choices', choiceIndex];
  };

  const getPhrases = (dictionary: DictionaryDataObject) =>
    dictionary.categories[0].phrases.map((phraseId) => new Phrase(dictionary.phrases[phraseId])); // maybe store computed value

  const getCurrentLanguage: ExerciseStoreUtils['getCurrentLanguage'] = () => get().lang.currentLanguage;
  const getOtherLanguage: ExerciseStoreUtils['getOtherLanguage'] = () => get().lang.otherLanguage;

  const utils: ExerciseStoreUtils = {
    uniqId,
    getCurrentLanguage,
    getOtherLanguage,
    selectChoice,
    resolveExercise,
    playAudio,
    playAudioSlow,
    delay,
  };

  const createExercise: Record<ExerciseType, (phrases: Phrase[]) => Exercise> = {
    identification: createFactoryOfExerciseIdentification(utils),
  };

  return {
    status: ExerciseStoreStatus.uninitialized,
    lang: { currentLanguage: getCountryVariant(), otherLanguage: 'uk' },
    dictionary: null,
    exerciseList: [], //maybe later, now generate one exercise at time
    exerciseIndex: 0,
    init: async (/*category*/) => {
      // fetch dictionary
      const dictionary = await fetchRawDictionary();
      // get category phrasesData
      const phrases = getPhrases(dictionary);
      // build exercise /// exercise list, list will include more types of exercises in future
      const exerciseList = Array(3)
        .fill(0)
        .map(() => createExercise[ExerciseType.identification](phrases));
      exerciseList[0].status = ExerciseStatus.active;
      set({
        status: ExerciseStoreStatus.ready,
        dictionary,
        exerciseIndex: 0,
        exerciseList,
      });
    },
    setLang: (lang) => set({ lang }),
  };
});
