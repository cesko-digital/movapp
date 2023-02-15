import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps } from 'next';
import { getServerSideTranslations } from '../../utils/localization';
import { Button } from 'components/basecomponents/Button';
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
  choiceList: Choice[];
  //correctChoiceId: number;
  resolve: (exercise: Exercise) => boolean; // how to resolve exercise is concern of Exercise, resolving might be called after every choice selection or later when user decides
}

// interface ExerciseIdentification extends Omit<Exercise, 'choiceList'> {
interface ExerciseIdentification extends Exercise {
  // ??? how to construct interfaces for a few types of exercises
  playAudio: () => void;
  playAudioSlow: () => void;
  choiceList: (Choice & {
    text: string;
  })[];
}

interface ExerciseStoreState {
  id: number;
  initialized: boolean;
  // language: {current:getCountryVariant(),other:'uk'};
  //exerciseList: Exercise[];
  exercise: Exercise | null;
}

interface ExerciseStoreActions {
  init: () => void;
}

/** Describes state of app at current moment, enables to save/restore app state */

const useExerciseStore = create<ExerciseStoreState & ExerciseStoreActions>((set, get) => {
  const playAudio = (url: string) => {
    // plays audio
    // store handles audio play = better control
    console.log(`playing ${url}`);
  };

  const playAudioSlow = (url: string) => {
    // plays audio
    // store handles audio play = better control
    console.log(`playing ${url}`);
  };

  // ensures that store knows about state changes //
  const selectChoice = async (exercise: Exercise, choiceIndex: number) => {
    // place to react on user input
    // place to handle user choice, disable buttons, animate exercise stuff
    const choice = get().exercise?.choiceList[choiceIndex] as Choice;

    if (choice.selected) {
      console.log(`choice ${choiceIndex} already selected`);
      return;
    }

    set(R.over(R.lensPath(['exercise', 'choiceList', choiceIndex, 'selected']), () => true));
    console.log(`selected choice ${choiceIndex} in exercise`);
  };

  /** expecting methods will point only to active excersice only --- that removes exercise index bloat */

  const resolveExercise = (exercise: Exercise) => {
    // place to react on exercise resolve
    // (resolve: () => boolean)
    // resolves exercise and take next action
    console.log(`resolving exercise`);
    if (get().exercise?.resolve(exercise)) {
      /* set exercise status completed */
      console.log(`exercise completed hooray...`);
      /* generate new exercise */
      console.log(`generating new exercise for you...`);
      set({ exercise: generateExerciseIdentification() });
    } else {
      /* notify user that it's not completed */
      console.log(`try again...`);
    }
  };

  const setChoiceRef = (choiceIndex: number, node: HTMLElement | null) => {
    if (node === null) return;
    set(R.over(R.lensPath(['exercise', 'choiceList', choiceIndex, 'ref']), () => node));
    console.log(`ref updated for choice ${choiceIndex}`);
  };

  // TODO: generate exercise from phrases of selected category

  const generateExerciseIdentification = (): ExerciseIdentification => {
    /** input parameters */
    const soundUrl = 'sound.mp3';
    const phrases = [
      { text: 'choice1', correct: false },
      { text: 'choice1', correct: true },
    ];

    const resolve = (exercise: Exercise) => {
      /*all correct choices selected*/
      // return exercise.choiceList.every((choice) => choice.selected && choice.correct); // for multiple correct answers , cant use selectAndResolve
      return (exercise.choiceList.find((choice) => choice.correct) as Choice).selected; // finds first occurence !!!
    }; // what triggers resolve??? a) user with button to apply choices b) system after each choice selection

    // service methods
    const getThisExercise = () => get().exercise; // points to active exercise or use exercise index for match in future
    const generateChoiceList = () =>
      phrases.map(({ text, correct }, index) => ({
        select: async () => {
          const choice = getThisExercise()?.choiceList[index] as Choice;
          // place to run animations depending on exercise type
          animation.playSelect(choice.ref as HTMLElement);
          // await playSelectAnimation(choice.ref as HTMLElement).finished; // wait for animation ends
          // use store method to select choice
          selectChoice(getThisExercise() as Exercise, index);
          // use store method to resolve exercise
          resolveExercise(getThisExercise() as Exercise);
          // All the logic could be here but...
        } /* set choice selected maybe call resolve */,
        text,
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
      choiceList: generateChoiceList(),
      resolve,
    };
  };

  return {
    id: 0,
    initialized: false,
    //exerciseList: [], maybe later now generate one exercise at time
    exercise: null,
    init: (/*category*/) => {
      // fetch dictionary
      // get category phrasesData
      // build exercise list, list will include more types of exercises in future
      set({
        initialized: true,
        exercise: generateExerciseIdentification(),
      });
    },
  };
});

const ExerciseSection = () => {
  const { t } = useTranslation();
  const init = useExerciseStore((state) => state.init);
  const initialized = useExerciseStore((state) => state.initialized);
  const exercise = useExerciseStore((state) => state.exercise);

  useEffect(() => {
    init();
  }, [init]);

  if (!initialized) return <p>waitting for init...</p>;

  const { choiceList, playAudio, playAudioSlow } = exercise as ExerciseIdentification;
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
        <ExerciseIdentification choiceList={choiceList} playAudio={playAudio} playAudioSlow={playAudioSlow} />
      </div>
    </div>
  );
};

interface ExerciseProps {
  choiceList: ExerciseIdentification['choiceList'];
  playAudio: () => void;
  playAudioSlow: () => void;
}

const ExerciseIdentification = ({ choiceList, playAudio, playAudioSlow }: ExerciseProps) => {
  // exercise: match audio to translated text
  // displays exercise data
  // offers controls

  return (
    <div className="flex flex-wrap content-start">
      <Button className="bg-primary-blue" text="PlayAudio" onClick={playAudio} />
      <Button className="bg-primary-blue" text="PlayAudioSlow" onClick={playAudioSlow} />
      {choiceList.map((choice, index) => (
        <Button
          className="bg-primary-blue"
          ref={choice.setRef}
          key={index}
          text={choice.text}
          onClick={choice.select}
          // style={{ color: choice.selected && !choice.correct ? 'gray' : 'black' }}
        />
      ))}
    </div>
  );
};

// const Report = () => {
//   // displays final report about exercise set
// };

const animation = {
  playSelect: (ref: HTMLElement) =>
    anime({
      targets: ref,
      duration: 200,
      opacity: 0.5,
      easing: 'easeInOutCubic',
      direction: 'alternate',
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
