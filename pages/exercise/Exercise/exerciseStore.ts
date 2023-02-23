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

interface Choice {
  select: (/*maybe some opt payload*/) => void; // predefined function provided to store, () => /*resolve definition in Exercise*/
  selected: boolean;
  correct: boolean;
  ref: HTMLElement | null;
  setRef: (node: HTMLElement | null) => void;
  //[propName: string]: any; // optional properties
}

export interface Exercise {
  id: number; // TODO: should have id - 1. as react key prop, 2. for reference identification
  type: ExerciseType;
  status: ExerciseStatus;
  //tryCounter: number
  choices: Choice[];
  //correctChoiceId: number;
  resolve: (exercise: Exercise) => boolean; // how to resolve exercise is concern of Exercise, resolving might be called after every choice selection or later when user decides
}

// interface ExerciseIdentification extends Omit<Exercise, 'choices'> { // prop choices override
export interface ExerciseIdentification extends Exercise {
  // ??? how to construct interfaces for a few types of exercises
  playAudio: () => void;
  playAudioSlow: () => void;
  choices: (Choice & {
    getText: () => string;
    getSoundUrl: () => string;
  })[];
}

interface ExerciseStoreState {
  id: number;
  initialized: boolean;
  lang: { currentLanguage: Language; otherLanguage: Language };
  dictionary: DictionaryDataObject | null;
  //exerciseList: Exercise[];
  exercise: Exercise | null;
}

interface ExerciseStoreActions {
  init: () => void;
  setLang: (lang: { currentLanguage: Language; otherLanguage: Language }) => void;
}

/** Describes state of app at current moment, enables to save/restore app state */

export const useExerciseStore = create<ExerciseStoreState & ExerciseStoreActions>((set, get) => {
  const playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const playAudioSlow = (url: string) => {
    // plays audio
    // store handles audio play = better control
    console.log(`playing ${url}`);
    playAudio(url);
  };

  // ensures that store knows about state changes //
  const selectChoice = async (exercise: Exercise, choiceIndex: number) => {
    // place to react on user input
    // place to handle user choice, disable buttons, animate exercise stuff
    const choice = get().exercise?.choices[choiceIndex] as Choice;

    if (choice.selected) {
      console.log(`choice ${choiceIndex} already selected`);
      return;
    }

    set(R.over(R.lensPath(['exercise', 'choices', choiceIndex, 'selected']), () => true));
    console.log(`selected choice ${choiceIndex} in exercise`);
  };

  /** expecting methods will point only to active excersice only --- that removes exercise index bloat */

  const resolveExercise = async (exercise: Exercise) => {
    // place to react on exercise resolve
    // (resolve: () => boolean)
    // resolves exercise and take next action
    console.log(`resolving exercise`);
    if (get().exercise?.resolve(exercise)) {
      /* set exercise status completed */
      console.log(`exercise completed hooray...`);
      await delay(1000);
      // increment id so it is a new game and components get nicely reset , fixes styles altered by animation
      /* generate new exercise */
      console.log(`generating new exercise for you...`);
      set((state) => ({
        id: state.id + 1,
        exercise: setId(generateExerciseIdentification(getPhrases(get().dictionary as DictionaryDataObject)), state.id + 1),
      })); // by docs updates should be merged automaticaly, but we can do it at once
    } else {
      /* notify user that it's not completed */
      console.log(`try again...`);
    }
  };

  const setChoiceRef = (choiceIndex: number, node: HTMLElement | null) => {
    if (node === null) return;
    set(R.over(R.lensPath(['exercise', 'choices', choiceIndex, 'ref']), () => node));
    console.log(`ref updated for choice ${choiceIndex}`);
  };

  const getPhrases = (dictionary: DictionaryDataObject) =>
    dictionary.categories[0].phrases.map((phraseId) => new Phrase(dictionary.phrases[phraseId])); // maybe store computed value

  const getCurrentLanguage = () => get().lang.currentLanguage;
  const getOtherLanguage = () => get().lang.otherLanguage;

  // TODO: refactor typescript types and interfaces

  const generateExerciseIdentification = (sourcePhrases: Phrase[]): ExerciseIdentification => {
    // filter feasible phrases for exercise, one word phrases
    const filterOneWordPhrase = (phrase: Phrase) =>
      phrase.getTranslation(getCurrentLanguage()).split(' ').length + phrase.getTranslation(getOtherLanguage()).split(' ').length === 2;

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
      /** FIXME: USE of array index instead of undependent id prop disables to shuffle chioces after creation  */
      .map((phrase, index) => ({ ...extractChoiceData(phrase), correct: index === 0 }))
      // shuffle choices
      .sort(() => Math.random() - 0.5);

    const resolve = (exercise: Exercise) => {
      /*all correct choices selected*/
      // return exercise.choices.every((choice) => choice.selected && choice.correct); // for multiple correct answers , cant use selectAndResolve
      return !!exercise.choices.find((choice) => choice.correct)?.selected; // finds first occurence !!!
    }; // what triggers resolve??? a) user with button to apply choices b) system after each choice selection

    // service methods
    const getThisExercise = () => get().exercise; // points to active exercise or use exercise index for match in future
    const generateChoices = () =>
      choicesData.map(({ getText, getSoundUrl, correct }, index) => ({
        select: async () => {
          const choice = (getThisExercise() as ExerciseIdentification)?.choices[index];
          // place to run animations depending on exercise type
          playAudio(choice.getSoundUrl());
          await animation.select(choice.ref as HTMLElement).finished;
          correct
            ? await animation.selectCorrect(choice.ref as HTMLElement).finished
            : await animation.selectWrong(choice.ref as HTMLElement).finished;
          // await playSelectAnimation(choice.ref as HTMLElement).finished; // wait for animation ends
          // use store method to select choice
          selectChoice(getThisExercise() as Exercise, index);
          // use store method to resolve exercise
          resolveExercise(getThisExercise() as Exercise);
          // All the logic could be here but...
          // CLEAN UP ANIMATIONS
        } /* set choice selected maybe call resolve */,
        getText,
        getSoundUrl,
        selected: false,
        correct,
        ref: null,
        setRef: (node: HTMLElement | null) => setChoiceRef(index, node), // maybe assign directly without external functtion
      })); // maybe put animations and sounds to exercise obj.

    /** Exercise output object */
    return {
      id: 0,
      type: ExerciseType.identification,
      status: ExerciseStatus.queued,
      playAudio: () => playAudio(getSoundUrl()),
      playAudioSlow: () => playAudioSlow(getSoundUrl()),
      choices: generateChoices(),
      resolve,
    };
  };

  return {
    id: 0,
    initialized: false,
    lang: { currentLanguage: getCountryVariant(), otherLanguage: 'uk' },
    dictionary: null,
    //exerciseList: [], maybe later now generate one exercise at time
    exercise: null,
    init: async (/*category*/) => {
      // fetch dictionary
      const dictionary = await fetchRawDictionary();
      // get category phrasesData
      const phrases = getPhrases(dictionary);
      // build exercise /// exercise list, list will include more types of exercises in future
      set({
        initialized: true,
        dictionary,
        exercise: setId(generateExerciseIdentification(phrases), 0), // setup id for each exercise
      });
    },
    setLang: (lang) => set({ lang }), // FIXME: reinit game when lang change
  };
});

interface WithId {
  id: number | string;
}
const setId = <T extends WithId>(obj: T, id: T['id']): T => ({ ...obj, id });
