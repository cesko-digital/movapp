import React, { useEffect } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { ExerciseType, Exercise, useExerciseStore, ExerciseIdentification } from './exerciseStore';
import { ExerciseIdentificationComponent } from './ExerciseIdentification';

const pairExercise = (type: ExerciseType) => {
  switch (type) {
    case ExerciseType.identification:
      return ExerciseIdentificationComponent;
  }
};

export const ExerciseOrchestrator = () => {
  const lang = useLanguage();
  const init = useExerciseStore((state) => state.init);
  const setLang = useExerciseStore((state) => state.setLang);
  const initialized = useExerciseStore((state) => state.initialized);
  const exercise = useExerciseStore((state) => state.exercise) as Exercise;

  useEffect(() => {
    setLang(lang);
  }, [setLang, lang]);

  useEffect(() => {
    init();
  }, [init]);

  if (!initialized) return <p>waitting for init...</p>;

  const ExerciseComponent = pairExercise(exercise.type as ExerciseType);

  // ID must be unique for every exercise in all games gameId+exerciseId
  return <ExerciseComponent key={exercise.id} exercise={exercise as ExerciseIdentification} />;
};
