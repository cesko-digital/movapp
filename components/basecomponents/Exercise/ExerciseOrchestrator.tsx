import React, { useEffect } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { ExerciseType, useExerciseStore, ExerciseStoreStatus } from './exerciseStore';
import { ExerciseIdentification, ExerciseIdentificationComponent } from './ExerciseIdentification';
import { CategoryDataObject } from 'utils/getDataUtils';

// TODO: integrate to dictionary
interface ExerciseOrchestratorProps {
  categories: CategoryDataObject['id'][];
}

export const ExerciseOrchestrator = ({ categories }: ExerciseOrchestratorProps) => {
  const lang = useLanguage();
  const init = useExerciseStore((state) => state.init);
  const setLang = useExerciseStore((state) => state.setLang);
  const status = useExerciseStore((state) => state.status);
  const exerciseList = useExerciseStore((state) => state.exerciseList);
  const getActiveExerciseIndex = useExerciseStore((state) => state.getActiveExerciseIndex);
  const controlsDisabled = useExerciseStore((state) => state.controlsDisabled);

  useEffect(() => {
    setLang(lang);
  }, [setLang, lang]);

  useEffect(() => {
    init(categories);
  }, [init, categories]);

  if (status === ExerciseStoreStatus.uninitialized) return <p>waitting for init...</p>;

  if (status === ExerciseStoreStatus.completed) return <p>exercise completed...</p>;

  const exercise = exerciseList[getActiveExerciseIndex()];

  switch (exercise.type as ExerciseType) {
    case ExerciseType.identification:
      return (
        <ExerciseIdentificationComponent
          key={exercise.id}
          exercise={exercise as ExerciseIdentification}
          controlsDisabled={controlsDisabled}
        />
      );
    default:
      return <p>something went wrong...</p>;
  }
};
