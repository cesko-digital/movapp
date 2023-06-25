import React, { useEffect, useRef } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { useExerciseStore, ExerciseStoreStatus, ExerciseStatus } from './exerciseStore';
import { AppContainer } from './components/AppContainer';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { ActionButton } from './components/ActionButton';
import Spinner from '../Spinner/Spinner';
import { animation } from './utils/animation';
import ExerciseConfiguration from './ExerciseConfiguration';
import { ExerciseDebugInfo } from './components/ExerciseDebugInfo';
import { ExerciseComponentLoader } from './components/ExerciseComponentLoader';
import { usePlausible } from 'next-plausible';

const Feedback = dynamic(() => import('./components/Feedback'), {
  ssr: false,
});

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
  const plausible = usePlausible();
  const init = useExerciseStore((state) => state.init);
  const cleanUp = useExerciseStore((state) => state.cleanUp);
  const setLang = useExerciseStore((state) => state.setLang);
  const setCategories = useExerciseStore((state) => state.setCategories);
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
    if (categoryIds === undefined || categoryIds.length === 0) return;
    setCategories(categoryIds);
  }, [setCategories, categoryIds]);

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
      <AppContainer>
        <ExerciseConfiguration />
      </AppContainer>
    );
  }

  if (status === ExerciseStoreStatus.active) {
    if (exercise === null) return <Loading />;
    return (
      <AppContainer headerContent={`${counter}/${size}`}>
        <ExerciseDebugInfo data={{ level: exercise.level, type: exercise.type, status: exercise.status }} />
        <ExerciseComponentLoader ref={exerciseRef} exercise={exercise} />
        <div className="flex justify-between w-full">
          <ActionButton buttonStyle="primaryLight" action="home" />
          <ActionButton
            key={exercise.id}
            ref={nextButtonRef}
            action="nextExercise"
            className={exercise.status === ExerciseStatus.completed ? 'visible' : 'invisible'}
            onClickAsync={async () => {
              if (exerciseRef.current === null || nextButtonRef.current === null) return;
              animation.diminish(nextButtonRef.current, 300);
              await animation.fade(exerciseRef.current, 300).finished;
            }}
          />
        </div>
      </AppContainer>
    );
  }

  if (status === ExerciseStoreStatus.completed)
    return (
      <AppContainer>
        <div className="flex flex-col items-center px-1.5 sm:px-3 pt-5 mb-6 bg-slate-50">
          <h4 className="mb-8 font-bold p-0">{t('exercise_page.congratulations')}</h4>
          <p className="text-justify">{t('exercise_page.you_have_finished')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 justify-stretch justify-items-stretch py-10">
            <ActionButton
              onClickAsync={() => {
                plausible('Exercise-Started', { props: { language: lang, length: size } });
                restart;
              }}
            >
              {t('exercise_page.restart') || ''}
            </ActionButton>
            <ActionButton action="home">{t('exercise_page.change_settings') || ''}</ActionButton>
          </div>
        </div>
        <Feedback />
      </AppContainer>
    );

  return <p>something went wrong...</p>;
};
