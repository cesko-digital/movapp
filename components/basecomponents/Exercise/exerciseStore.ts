import { fetchRawDictionary, DictionaryDataObject, Phrase } from 'utils/getDataUtils';
import { getCountryVariant, Language } from 'utils/locales';
import { AudioPlayer } from 'utils/AudioPlayer';
import { animation } from './animation';
import { create } from 'zustand';
import * as R from 'ramda';

/* eslint-disable no-console */

enum ExerciseStatus {
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

interface Choice extends WithId {
  select: () => void;
  selected: boolean;
  correct: boolean;
  ref: HTMLElement | null;
  setRef: (node: HTMLElement | null) => void;
  //[propName: string]: any; // optional properties
}

export interface Exercise extends WithId {
  type: ExerciseType;
  status: ExerciseStatus;
  choices: Choice[];
  resolve: (exercise: Exercise) => boolean; // how to resolve exercise is concern of Exercise, resolving might be called after every choice selection or later when user decides
}

// interface ExerciseIdentification extends Omit<Exercise, 'choices'> { // prop choices override
export interface ExerciseIdentification extends Exercise {
  playAudio: () => void;
  playAudioSlow: () => void;
  playAudioButtonRef: HTMLElement | null;
  playAudioSlowButtonRef: HTMLElement | null;
  setPlayAudioButtonRef: (ref: HTMLElement | null) => void;
  setPlayAudioSlowButtonRef: (ref: HTMLElement | null) => void;
  choices: (Choice & {
    getText: () => string;
    getSoundUrl: () => string;
  })[];
}

interface ExerciseStoreState {
  initialized: boolean;
  lang: { currentLanguage: Language; otherLanguage: Language };
  dictionary: DictionaryDataObject | null;
  exerciseList: Exercise[];
  exerciseIndex: number;
}

interface ExerciseStoreActions {
  init: () => void;
  setLang: (lang: { currentLanguage: Language; otherLanguage: Language }) => void;
}

/** Describes complete state of the app, enables to save/restore app state */

export const useExerciseStore = create<ExerciseStoreState & ExerciseStoreActions>((set, get) => {
  const uniqId = (() => {
    let id = 0;
    return () => {
      const out = id;
      id = id + 1;
      return out;
    };
  })();

  const playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const playAudioSlow = (url: string) => {
    // plays audio
    // store handles audio play = better control
    console.log(`playing ${url}`);
    playAudio(url);
  };

  /** @assume methods will operate on active excersice only --- that removes exercise index bloat @but might cause changing other's props */

  // ensures that store knows about state changes //
  const selectChoice = async (choiceId: Choice['id']) => {
    // place to react on user input
    // place to handle user choice, disable buttons, animate exercise stuff
    const choicePath = getChoicePath(choiceId);
    const choice = R.view(R.lensPath(choicePath), get());
    if (choice.selected) {
      console.log(`choice ${choiceId} already selected`);
      return;
    }
    // set choice selected
    set(R.over(R.lensPath([...choicePath, 'selected']), () => true));
    console.log(`selected choice ${choiceId} in exercise`);
    console.log(get().exerciseList);
  };

  const resolveExercise = async () => {
    // place to react on exercise resolve
    // resolves exercise and take next action
    console.log(`resolving active exercise`);
    const exercise = getActiveExercise();
    if (exercise.resolve(exercise)) {
      /* set exercise status completed */
      set(R.over(R.lensPath(['exerciseList', get().exerciseIndex, 'status']), () => ExerciseStatus.completed));
      console.log(`exercise completed hooray...`);
      await delay(1000);
      // increment id so it is a new game and components get nicely reset , fixes styles altered by animation
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
  const hasSameId = R.curry((id: WithId['id'], obj: WithId) => id === obj['id']);

  // choice id look up tested with 100 exercices and x6 CPU slowdown, it was OK, lightning fast
  // const findExercise = (exerciseId: number) => get().exercises.findIndex(({id}) => id === exerciseId);
  const findChoice = (choiceId: Choice['id']) => {
    const exercise = getActiveExercise();
    if (exercise === null) throw Error('exercise is null');
    const result = exercise.choices.find(hasSameId(choiceId));
    if (result === undefined) throw Error(`choice ${choiceId} not found`);
    return result;
  };

  const getChoicePath = (choiceId: number) => {
    const exercise = getActiveExercise();
    if (exercise === null) throw Error('exercise is null');
    // const exerciseIndex = 0;
    const choiceIndex = exercise.choices.findIndex(({ id }) => id === choiceId);
    return ['exerciseList', get().exerciseIndex, 'choices', choiceIndex];
  };

  const setChoiceRef = (choiceId: number, node: HTMLElement | null) => {
    if (node === null) return; // important, disables overwrite of active exercise ref by disposed exercise
    set(R.over(R.lensPath([...getChoicePath(choiceId), 'ref']), () => node));
    console.log(`ref updated for choice ${choiceId}`);
  };

  const setPlayAudioButtonRef = (node: HTMLElement | null) => {
    if (node === null) return;
    set(R.over(R.lensPath(['exerciseList', get().exerciseIndex, 'playAudioButtonRef']), () => node));
    console.log(`playAudioButtonRef updated`);
  };

  const setPlayAudioSlowButtonRef = (node: HTMLElement | null) => {
    if (node === null) return;
    set(R.over(R.lensPath(['exerciseList', get().exerciseIndex, 'playAudioSlowButtonRef']), () => node));
    console.log(`playAudioSlowButtonRef updated`);
  };

  const getPhrases = (dictionary: DictionaryDataObject) =>
    dictionary.categories[0].phrases.map((phraseId) => new Phrase(dictionary.phrases[phraseId])); // maybe store computed value

  const getCurrentLanguage = () => get().lang.currentLanguage;
  const getOtherLanguage = () => get().lang.otherLanguage;

  const filterOneWordPhrase = (phrase: Phrase) =>
    phrase.getTranslation(getCurrentLanguage()).split(' ').length + phrase.getTranslation(getOtherLanguage()).split(' ').length === 2;

  // TODO: EXTRACT each exercise to separate module
  
  const generateExerciseIdentification = (sourcePhrases: Phrase[]): ExerciseIdentification => {
    const exerciseId = uniqId();
    // filter feasible phrases for exercise, one word phrases

    const pickedPhrases = sourcePhrases
      // filter
      .filter(filterOneWordPhrase)
      // shuffle
      .sort(() => Math.random() - 0.5)
      // pick 4
      .slice(0, 4);

    console.log(pickedPhrases);

    /** input parameters */
    const getSoundUrl = () => pickedPhrases[0].getSoundUrl(getOtherLanguage());
    const extractChoiceData = (phrase: Phrase) => ({
      getText: () => phrase.getTranslation(getCurrentLanguage()),
      getSoundUrl: () => phrase.getSoundUrl(getOtherLanguage()),
    });
    const choicesData = pickedPhrases
      .map((phrase, index) => ({ ...extractChoiceData(phrase), correct: index === 0 }))
      // shuffle choices
      .sort(() => Math.random() - 0.5);

    const resolve = (exercise: Exercise) => {
      /*all correct choices selected*/
      // return exercise.choices.every((choice) => choice.selected && choice.correct); // for multiple correct answers , cant use selectAndResolve
      return !!exercise.choices.find((choice) => choice.correct)?.selected; // finds first occurence !!!
    }; // what triggers resolve??? a) user with button to apply choices b) system after each choice selection

    const generateChoices = () =>
      choicesData.map(({ getText, getSoundUrl, correct }) => {
        const choiceId = uniqId();
        return {
          id: choiceId,
          select: async () => {
            // ref could be passed as parameter, but store looses control of other refs then
            const choice = findChoice(choiceId) as ExerciseIdentification['choices'][0];
            const choiceRef = choice.ref as HTMLElement;
            // place to run animations depending on exercise type
            playAudio(choice.getSoundUrl());
            await animation.select(choiceRef).finished;
            correct ? await animation.selectCorrect(choiceRef).finished : await animation.selectWrong(choiceRef).finished;
            // use store method to select choice
            selectChoice(choiceId);
            // use store method to resolve exercise
            resolveExercise();
            // All the logic could be here but...
            // CLEAN UP ANIMATIONS
          },
          getText,
          getSoundUrl,
          selected: false,
          correct,
          ref: null,
          setRef: (node: HTMLElement | null) => setChoiceRef(choiceId, node), // store is notified about ref change
        };
      }); // maybe put animations and sounds to exercise obj.

    const choices = generateChoices();

    /** Exercise output object */
    return {
      id: exerciseId,
      type: ExerciseType.identification,
      status: ExerciseStatus.queued,
      playAudio: () => playAudio(getSoundUrl()), // TODO: animate button when sound is played, handle click when playing
      playAudioSlow: () => {
        const playAudioSlowButtonRef = (getActiveExercise() as ExerciseIdentification).playAudioSlowButtonRef;
        animation.select(playAudioSlowButtonRef as HTMLElement);
        playAudioSlow(getSoundUrl());
      },
      playAudioButtonRef: null,
      playAudioSlowButtonRef: null,
      setPlayAudioButtonRef,
      setPlayAudioSlowButtonRef,
      choices,
      resolve,
    };
  };

  return {
    initialized: false,
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
      const exerciseList = Array(10)
        .fill(0)
        .map(() => generateExerciseIdentification(phrases));
      exerciseList[0].status = ExerciseStatus.active;
      set({
        initialized: true,
        dictionary,
        exerciseIndex: 0,
        exerciseList,
      });
    },
    setLang: (lang) => set({ lang }),
  };
});

// const setId = <T extends WithId>(obj: T, id: T['id']): T => ({ ...obj, id });
