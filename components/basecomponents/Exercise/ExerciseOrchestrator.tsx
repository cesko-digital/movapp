import React, { useEffect } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { ExerciseType, useExerciseStore, ExerciseStoreStatus } from './exerciseStore';
import { ExerciseIdentificationComponent, ExerciseIdentification } from './ExerciseIdentification';

const getExerciseComponent = (type: ExerciseType) => {
  switch (type) {
    case ExerciseType.identification:
      return ExerciseIdentificationComponent;
  }
};

export const ExerciseOrchestrator = () => {
  const lang = useLanguage();
  const init = useExerciseStore((state) => state.init);
  const setLang = useExerciseStore((state) => state.setLang);
  const status = useExerciseStore((state) => state.status);
  const exerciseList = useExerciseStore((state) => state.exerciseList);
  const exerciseIndex = useExerciseStore((state) => state.exerciseIndex);

  useEffect(() => {
    setLang(lang);
  }, [setLang, lang]);

  useEffect(() => {
    init();
  }, [init]);

  if (status === ExerciseStoreStatus.uninitialized) return <p>waitting for init...</p>;

  if (status === ExerciseStoreStatus.completed) return <p>exercise completed...</p>;

  const exercise = exerciseList[exerciseIndex];
  const ExerciseComponent = getExerciseComponent(exercise.type as ExerciseType);

  // ID must be unique for every exercise in all games gameId+exerciseId
  return <ExerciseComponent key={exercise.id} exercise={exercise as ExerciseIdentification} />;
};
