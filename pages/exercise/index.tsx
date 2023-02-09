import { useTranslation } from 'next-i18next';
import React, { useEffect } from 'react';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps } from 'next';
import { getServerSideTranslations } from '../../utils/localization';
import { Button } from 'components/basecomponents/Button';
import { create } from 'zustand';

enum ExerciseStatus {
  queued = 'queued',
  active = 'active',
  succeeded = 'succeeded',
  failed = 'failed',
}

enum ExerciseType {
  identification = 'identification',
}

interface Choice {
  id: number;
  selectChoice: (/*maybe some opt payload*/) => void; // predefined function provided to store, () => /*resolve definition in Exercise*/
  // ref: React.ElementRef<>
}

interface Exercise {
  id: number; // key for Exercise component
  type: ExerciseType;
  status: ExerciseStatus;
  //tryCounter: number
  //choiceList: Choice[];
  //correctChoiceId: number;
  resolve: () => boolean; // how to resolve exercise is concern of Exercise, resolving might be called after every choise selection or later when user decides
}

interface ExerciseIdentification extends Omit<Exercise, 'choiceList'> {
  // ??? how to construct interfaces for a few types of exercises
  playAudio: () => void;
  playAudioSlow: () => void;
  choiceList: (Choice & { text: string; selected: boolean; correct: boolean })[];
}

interface ExerciseState {
  id: number;
  initialized: boolean;
  // language: {current:getCountryVariant(),other:'uk'};
  //exerciseList: Exercise[];
  exercise: Exercise | null;
}

interface ExerciseActions {
  init: () => void;
}

const useExerciseStore = create<ExerciseState & ExerciseActions>((set, get) => {
  const playAudio = (url: string) => {
    // plays audio
    // store handles audio play = better control
    console.log(`playing ${url}`);
  };

  const selectChoice = (exercieId: number, choiceId: number) => {
    // resolves selected choice and take next action
    console.log(`selected choice ${choiceId} in exercise ${exercieId}`);
  };

  const resolveExercise = (exercieId: number) => {
    // resolves exercise and take next action
    console.log(`resolving exercise ${exercieId}`);
  };

  const generateExercise = () => ({
    id: 1,
    type: ExerciseType.identification,
    status: ExerciseStatus.queued,
    playAudio: () => playAudio('sound.mp3'),
    playAudioSlow: () => playAudio('sound.mp3'),
    choiceList: [
      { id: 1, selectChoice: () => selectChoice(1, 1), text: 'hello', selected: false, correct: true },
      { id: 2, selectChoice: () => selectChoice(1, 2), text: 'world', selected: false, correct: false },
    ],
    resolve: () => resolveExercise(1), // what triggers resolve???
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
        exercise: generateExercise() as ExerciseIdentification,
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
        {choiceList.map((choice) => (
          <Button key={choice.id} text={choice.text} onClick={choice.selectChoice} />
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
