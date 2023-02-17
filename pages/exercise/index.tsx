import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant, Language } from 'utils/locales';
import { useLanguage } from 'utils/useLanguageHook';
import { GetStaticProps } from 'next';
import { getServerSideTranslations } from '../../utils/localization';
import { Button } from 'components/basecomponents/Button';
import { fetchRawDictionary, DictionaryDataObject, Phrase } from 'utils/getDataUtils';
import { AudioPlayer } from 'utils/AudioPlayer';
import { create } from 'zustand';
import * as R from 'ramda';
import anime from 'animejs';

/* eslint-disable no-console */

enum ExerciseStatus {
  queued = 'queued',
  active = 'active',
  completed = 'completed',
  failed = 'failed',
}

enum ExerciseType {
  identification = 'identification',
}

interface Choice {
  select: (/*maybe some opt payload*/) => void; // predefined function provided to store, () => /*resolve definition in Exercise*/
  selected: boolean;
  correct: boolean;
  ref: HTMLElement | null;
  setRef: (node: HTMLElement | null) => void;
}

interface Exercise {
  type: ExerciseType;
  status: ExerciseStatus;
  //tryCounter: number
  choices: Choice[];
  //correctChoiceId: number;
  resolve: (exercise: Exercise) => boolean; // how to resolve exercise is concern of Exercise, resolving might be called after every choice selection or later when user decides
}

// interface ExerciseIdentification extends Omit<Exercise, 'choices'> {
interface ExerciseIdentification extends Exercise {
  // ??? how to construct interfaces for a few types of exercises
  playAudio: () => void;
  playAudioSlow: () => void;
  choices: (Choice & {
    text: string;
    soundUrl: string;
  })[];
}

interface ExerciseStoreState {
  id: number;
  initialized: boolean;
  lang: { currentLanguage: Language; otherLanguage: Language };
  dictionary: DictionaryDataObject | null;
  // language: {current:getCountryVariant(),other:'uk'};
  //exerciseList: Exercise[];
  exercise: Exercise | null;
}

interface ExerciseStoreActions {
  init: () => void;
  setLang: (lang: { currentLanguage: Language; otherLanguage: Language }) => void;
}

/** Describes state of app at current moment, enables to save/restore app state */

const useExerciseStore = create<ExerciseStoreState & ExerciseStoreActions>((set, get) => {
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
      // increment id so it is a new game and components get nicely reset , fix styles altered by animation
      set((state) => ({ id: state.id + 1 }));
      /* generate new exercise */
      console.log(`generating new exercise for you...`);
      set({ exercise: generateExerciseIdentification(getPhrases(get().dictionary as DictionaryDataObject)) });
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
    dictionary.categories[0].phrases.map((phraseId) => new Phrase(dictionary.phrases[phraseId]));

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
    const soundUrl = pickedPhrases[0].getSoundUrl(getOtherLanguage());
    const extractChoiceData = (phrase: Phrase) => ({
      text: phrase.getTranslation(getCurrentLanguage()),
      soundUrl: phrase.getSoundUrl(getOtherLanguage()),
    });
    const choicesData = pickedPhrases
      .map((phrase, index) => ({ ...extractChoiceData(phrase), correct: index === 0 }))
      // shuffle choices
      .sort(() => Math.random() - 0.5);

    const resolve = (exercise: Exercise) => {
      /*all correct choices selected*/
      // return exercise.choices.every((choice) => choice.selected && choice.correct); // for multiple correct answers , cant use selectAndResolve
      return (exercise.choices.find((choice) => choice.correct) as Choice).selected; // finds first occurence !!!
    }; // what triggers resolve??? a) user with button to apply choices b) system after each choice selection

    // service methods
    const getThisExercise = () => get().exercise; // points to active exercise or use exercise index for match in future
    const generateChoices = () =>
      choicesData.map(({ text, soundUrl, correct }, index) => ({
        select: async () => {
          const choice = getThisExercise()?.choices[index] as Choice & { soundUrl: string };
          // place to run animations depending on exercise type
          playAudio(choice.soundUrl);
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
        text,
        soundUrl,
        selected: false,
        correct,
        ref: null,
        setRef: (node: HTMLElement | null) => setChoiceRef(index, node), // maybe assign directly without external functtion
      })); // maybe put animations and sounds to exercise obj.

    /** Exercise output object */
    return {
      type: ExerciseType.identification,
      status: ExerciseStatus.queued,
      playAudio: () => playAudio(soundUrl),
      playAudioSlow: () => playAudioSlow(soundUrl),
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
        exercise: generateExerciseIdentification(phrases),
      });
    },
    setLang: (lang) => set({ lang }),
  };
});

const ExerciseSection = () => {
  const { t } = useTranslation();
  const lang = useLanguage();
  const init = useExerciseStore((state) => state.init);
  const setLang = useExerciseStore((state) => state.setLang);
  const initialized = useExerciseStore((state) => state.initialized);
  const exercise = useExerciseStore((state) => state.exercise);
  const id = useExerciseStore((state) => state.id);

  useEffect(() => {
    setLang(lang);
  }, [setLang, lang]);

  useEffect(() => {
    init();
  }, [init]);

  if (!initialized) return <p>waitting for init...</p>;

  const { choices, playAudio, playAudioSlow } = exercise as ExerciseIdentification;
  // ######## prepare component in store????
  // pair Exercise type with component

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap justify-center min-h-screen m-auto sm:py-10 px-2 sm:px-4">
        <ExerciseIdentification key={id} choices={choices} playAudio={playAudio} playAudioSlow={playAudioSlow} />
      </div>
    </div>
  );
};

interface ExerciseProps {
  choices: ExerciseIdentification['choices'];
  playAudio: () => void;
  playAudioSlow: () => void;
}

const ExerciseIdentification = ({ choices, playAudio, playAudioSlow }: ExerciseProps) => {
  // exercise: match audio to translated text
  // displays exercise data
  // offers controls

  return (
    <div className="flex flex-col items-center">
      <div className="flex mb-3">
        <Button className="bg-primary-blue mr-3" text="PlayAudio" onClick={playAudio} />
        <Button className="bg-primary-blue" text="PlayAudioSlow" onClick={playAudioSlow} />
      </div>
      <div className="flex">
        {choices.map((choice, index) => (
          <Button
            className="bg-primary-blue mr-3"
            ref={choice.setRef}
            key={index}
            text={choice.text}
            onClick={choice.select}
            // style={{ color: choice.selected && !choice.correct ? 'gray' : 'black' }}
          />
        ))}
      </div>
    </div>
  );
};

// const Report = () => {
//   // displays final report about exercise set
// };

const animation = {
  select: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 200,
      opacity: 0.5,
      easing: 'easeInOutCubic',
      direction: 'alternate',
    }),
  selectCorrect: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 600,
      background: 'hsl(50, 100%, 50%)',
      color: 'hsl(50, 100%, 25%)',
      easing: 'easeInOutCubic',
    }),
  selectWrong: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 600,
      background: 'hsl(0, 0%, 40%)',
      easing: 'easeInOutCubic',
    }),
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      ...localeTranslations,
    },
  };
};

export default ExerciseSection;
