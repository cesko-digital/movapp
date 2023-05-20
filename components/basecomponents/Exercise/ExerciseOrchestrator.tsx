import React, { useEffect, useRef } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { ExerciseType, useExerciseStore, ExerciseStoreStatus, ExerciseStatus } from './exerciseStore';
import { ExerciseIdentification } from './ExerciseIdentification';
import { ExerciseIdentificationComponent } from './components/ExerciseIdentificationComponent';
import BetaIcon from 'public/icons/beta.svg';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { ActionButton } from './components/ActionButton';
import Spinner from '../Spinner/Spinner';
import { create } from 'zustand';
import { animation } from './utils/animation';
import ExerciseConfiguration from './ExerciseConfiguration';

interface PendingStore {
  pending: boolean;
  setPending: (val: boolean) => void;
}

// global state of pending action, ActionButtons are disabled when pending is true
export const usePendingStore = create<PendingStore>((set) => ({
  pending: false,
  setPending: (val) => set({ pending: val }),
}));

const Feedback = dynamic(() => import('./components/Feedback'), {
  ssr: false,
});

interface AppContainerProps {
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

const AppContainer: React.FunctionComponent<AppContainerProps> = ({ children, headerContent }) => {
  return (
    <div className="w-full sm:w-10/12 max-w-2xl bg-white">
      <div className="flex items-center justify-between mt-3 mb-5 pr-5">
        <BetaIcon />
        <div>{headerContent}</div>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
};

const Loading = () => (
  <AppContainer>
    <div className="flex items-center justify-center">
      <Spinner />
    </div>
  </AppContainer>
);

interface ExerciseOrchestratorProps {
  categoryIds?: string[];
  quickStart?: boolean;
}

// warning: language switching triggers categories props change, probably because staticpaths/props, quickstart isn't change triggered
export const ExerciseOrchestrator = ({ categoryIds, quickStart = false }: ExerciseOrchestratorProps) => {
  const lang = useLanguage();
  const init = useExerciseStore((state) => state.init);
  const cleanUp = useExerciseStore((state) => state.cleanUp);
  const setLang = useExerciseStore((state) => state.setLang);

  const status = useExerciseStore((state) => state.status);
  const exercise = useExerciseStore((state) => state.exercise);
  const restart = useExerciseStore((state) => state.restart);
  const counter = useExerciseStore((state) => state.counter);
  const size = useExerciseStore((state) => state.size);

  const { t } = useTranslation();
  const exerciseRef = useRef(null);
  const nextButtonRef = useRef(null);
  const exerciseStatus = exercise?.status;

  useEffect(() => {
    setLang(lang);
  }, [setLang, lang]);

  useEffect(() => {
    init(quickStart === true);
    return () => {
      cleanUp();
    };
  }, [init, cleanUp, quickStart]);

  // animate elements on Exercise.complete
  useEffect(() => {
    if (exerciseStatus === ExerciseStatus.completed) {
      if (nextButtonRef.current === null) return;
      animation.grow(nextButtonRef.current);
    }
  }, [exerciseStatus]);

  if (status === ExerciseStoreStatus.uninitialized) return <Loading />;

  if (status === ExerciseStoreStatus.initialized) {
    return (
      // replace with start/setup screen component
      <AppContainer>
        <ExerciseConfiguration categoryIds={categoryIds} />
      </AppContainer>
    );
  }

  if (status === ExerciseStoreStatus.active) {
    if (exercise === null) return <Loading />;
    switch (exercise.type) {
      case ExerciseType.audioIdentification:
      case ExerciseType.textIdentification:
        return (
          <AppContainer headerContent={`${counter}/${size}`}>
            <ExerciseIdentificationComponent ref={exerciseRef} key={exercise.id} exercise={exercise as ExerciseIdentification} />
            <div className="flex justify-between w-full">
              <ActionButton buttonStyle="primaryLight" action="home" />
              <ActionButton
                key={exercise.id}
                ref={nextButtonRef}
                action="nextExercise"
                className={exercise.status === ExerciseStatus.completed ? 'visible' : 'invisible'}
                // disabled={!(exercise.status === ExerciseStatus.completed)}
                onClickAsync={async () => {
                  if (exerciseRef.current === null || nextButtonRef.current === null) return;
                  animation.diminish(nextButtonRef.current, 300);
                  await animation.fade(exerciseRef.current, 300).finished;
                }}
              />
            </div>
          </AppContainer>
        );
      // TODO: add other types of exercises
      default:
        return <p>something went wrong...</p>;
    }
  }

  if (status === ExerciseStoreStatus.completed)
    return (
      <AppContainer>
        <div className="flex flex-col items-center px-1.5 sm:px-3 pt-5 mb-6 bg-slate-50">
          <h4 className="mb-8 font-bold p-0">{t('exercise_page.congratulations')}</h4>
          <p className="text-justify">{t('exercise_page.you_have_finished')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 justify-stretch justify-items-stretch py-10">
            <ActionButton onClickAsync={restart}>{t('exercise_page.next') || ''}</ActionButton>
            <ActionButton action="home" />
          </div>
        </div>
        <Feedback />
      </AppContainer>
    );

  return <p>something went wrong...</p>;
};
