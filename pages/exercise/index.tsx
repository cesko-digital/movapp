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
  selectChoice: (/*maybe some opt payload*/) => void; // predefined function provided to store, () => /*resolve definition in Exercise*/ handleChoiceSelection(exId,choiceId)
  data: Record<string, unknown>;
  // ref: React.ElementRef<>
}

// interface Choice {
//   id: number;
//   selectChoice: () => void;
// }

// interface ExerciseIdentification {

//   choiceList: (Choice & {text:string})[];

// }

interface Exercise {
  id: number; // key for Exercise component
  type: ExerciseType;
  status: ExerciseStatus;
  data: Record<string, unknown>;
  correctChoiceId: number;
  choiceList: Choice[];
  resolveChoice: (choiceId: number) => boolean; // how to resolve choice is concern of Exercise
}

interface ExerciseState {
  id: number;
  initialized: boolean;
  // language: {current:getCountryVariant(),other:'uk'};
  exerciseList: Exercise[];
}

interface ExerciseActions {
  init: () => void;
  playAudio: (url: string) => void;
  selectChoice: (exId: number, choiceId: number, resolveChoice: Exercise['resolveChoice']) => void;
  renderExercise: () => JSX.Element;
}

const useExerciseStore = create<ExerciseState & ExerciseActions>((set, get) => ({
  id: 0,
  initialized: false,
  exerciseList: [],
  init: (/*category*/) => {
    // fetch dictionary
    // get category phrasesData
    // build exercise list, list will include more types of exercises in future
    set({
      initialized: true,
      exerciseList: [
        {
          id: 1,
          type: ExerciseType.identification,
          status: ExerciseStatus.queued,
          data: {
            soundUrl: 'sound.mp3',
          },
          correctChoiceId: 2,
          choiceList: [
            { id: 1, selectChoice: () => console.log(`selected hello`), data: { text: 'hello' } },
            { id: 2, selectChoice: () => console.log(`selected world`), data: { text: 'world' } },
          ],
          resolveChoice: (id) => {
            console.log(`resolving choise id ${id}`);
            return true;
          },
        },
      ],
    });
  },
  playAudio: (url) => {
    // plays audio
    // store handles audio play = better control
  },
  selectChoice: (resolveChoice) => {
    // resolves selected choice and take next action
  },
  renderExercise: () => {
    if (!get().initialized) return <p>waiting for init...</p>;
    return <p>exercise</p>;
  },
}));

const ExerciseSection = () => {
  const { t } = useTranslation();
  const init = useExerciseStore((state) => state.init);
  const initialized = useExerciseStore((state) => state.initialized);
  const renderExercise = useExerciseStore((state) => state.renderExercise);
  const exerciseList = useExerciseStore((state) => state.exerciseList);

  useEffect(() => {
    init();
  }, [init]);

  if (!initialized) return <p>waiting for init...</p>;

  const {
    choiceList,
    data: { soundUrl },
  } = exerciseList[0];

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap justify-center min-h-screen m-auto sm:py-10 px-2 sm:px-4">
        <ExerciseIdentification choiceList={choiceList} playAudio={() => console.log(`playing audio ${soundUrl}`)} />
      </div>
    </div>
  );
};

interface ExerciseProps {
  choiceList: Choice[];
  playAudio: () => void;
}

const ExerciseIdentification = ({ choiceList, playAudio }: ExerciseProps) => {
  // exercise: match audio to translated text
  // displays exercise data
  // offers controls
  return (
    <div className="flex flex-wrap">
      <Button text="PlayAudio" onClick={playAudio} />
      <div className="flex flex-wrap">
        {choiceList.map((choice) => (
          <Button key={choice.id} text={choice.data.text as string} onClick={choice.selectChoice} />
        ))}
      </div>
    </div>
  );
};

const Report = () => {
  // displays final report about exercise set
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
