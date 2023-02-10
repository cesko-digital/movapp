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
  // ref: React.ElementRef<>
}

interface Exercise {
  type: ExerciseType;
  status: ExerciseStatus;
  //tryCounter: number
  choiceList: Choice[];
  //correctChoiceId: number;
  resolve: () => boolean; // how to resolve exercise is concern of Exercise, resolving might be called after every choice selection or later when user decides
}

// interface ExerciseIdentification extends Omit<Exercise, 'choiceList'> {
interface ExerciseIdentification extends Exercise {
  // ??? how to construct interfaces for a few types of exercises
  playAudio: () => void;
  playAudioSlow: () => void;
  choiceList: (Choice & {
    text: string;
    ref: React.Ref<HTMLButtonElement> | null;
    setRef: (node: HTMLElement | null) => void;
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

  // ensures that store knows about state changes //
  const selectChoice = async (exerciseIndex: number, choiceIndex: number) => {
    // maybe pass reference to exercise and choice
    // resolves selected choice and take next action
    const choice = get().exercise?.choiceList[choiceIndex];
    await anime({
      targets: choice.ref,
      duration: 200,
      opacity: 0.5,
      easing: 'linear',
      direction: 'alternate',
    }).finished;

    if (choice.selected) {
      console.log(`choice ${choiceIndex} already selected`);
      return;
    }

    set(R.over(R.lensPath(['exercise', 'choiceList', choiceIndex, 'selected']), () => true));
    console.log(`selected choice ${choiceIndex} in exercise ${exerciseIndex}`);
  };

  const selectChoiceAndResolve = async (exerciseIndex: number, choiceIndex: number) => {
    // maybe pass reference to exercise and choice // or pass selectChoice + resolve
    // resolves selected choice and take next action
    // if (get().exercise?.choiceList[choiceIndex].selected) {
    //   console.log(`choice ${choiceIndex} already selected`);
    //   return;
    // }
    await selectChoice(exerciseIndex, choiceIndex);
    resolveExercise(exerciseIndex);
  };

  const resolveExercise = (exerciseIndex: number) => {
    // (resolve: () => boolean)
    // resolves exercise and take next action
    console.log(`resolving exercise ${exerciseIndex}`);
    if (get().exercise?.resolve()) {
      /* set exercise status completed */
      console.log(`exercise ${exerciseIndex} completed hooray...`);
      /* generate new exercise */
      console.log(`generating new exercise for you...`);
      set({ exercise: generateExercise() });
    } else {
      /** do nothing */
      console.log(`exercise ${exerciseIndex} not completed yet`);
    }
  };

  const setChoiceRef = (exerciseIndex: number, choiceIndex: number, node: HTMLElement | null) => {
    if (node === null) return;
    set(R.over(R.lensPath(['exercise', 'choiceList', choiceIndex, 'ref']), () => node));
    console.log(`ref updated for choice ${choiceIndex}`);
  };

  const generateExercise = (): ExerciseIdentification => ({
    type: ExerciseType.identification,
    status: ExerciseStatus.queued,
    playAudio: () => playAudio('sound.mp3'),
    playAudioSlow: () => playAudio('sound.mp3'),
    choiceList: [
      {
        select: () => selectChoiceAndResolve(0, 0) /* set choice selected maybe call resolve */,
        text: 'hello',
        selected: false,
        correct: true,
        ref: null,
        setRef: (node) => setChoiceRef(0, 0, node),
      }, // maybe put animations and sounds to exercise obj.
      {
        select: () => selectChoiceAndResolve(0, 1),
        text: 'world',
        selected: false,
        correct: false,
        ref: null,
        setRef: (node) => setChoiceRef(0, 1, node),
      },
    ],
    resolve: () => {
      /*all correct choices selected*/
      const exercise = get().exercise as ExerciseIdentification; // provide refence to exercise instead of calling get(), is it save => its not??
      // return exercise.choiceList.every((choice) => choice.selected && choice.correct); // for multiple correct answers , cant use selectAndResolve
      return (exercise.choiceList.find((choice) => choice.correct) as Choice).selected;
    }, // what triggers resolve??? a) user with button to apply choices b) system after each choice selection
  });

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
        exercise: generateExercise(),
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
    <div className="flex flex-wrap">
      <Button text="PlayAudio" onClick={playAudio} />
      <Button text="PlayAudioSlow" onClick={playAudioSlow} />
      <div className="flex flex-wrap">
        {choiceList.map((choice, index) => (
          <Button
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      ...localeTranslations,
    },
  };
};

export default ExerciseSection;
