import { useEffect, useRef } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { usePlausible } from 'next-plausible';
import { ExerciseStoreStatus, useExerciseStore } from 'components/basecomponents/Exercise/exerciseStore';
import { ExerciseStatus } from 'components/basecomponents/Exercise/exerciseStore';

/* eslint-disable no-console */

export const useTracking = () => {
  const history = useExerciseStore((state) => state.history);
  const size = useExerciseStore((state) => state.size);
  const status = useExerciseStore((state) => state.status);

  const plausible = usePlausible();
  const { currentLanguage } = useLanguage();

  const prevStatus = useRef(status);

  // one useEffect for each event

  // Exercise set started
  useEffect(() => {
    if (status === ExerciseStoreStatus.active && prevStatus.current !== ExerciseStoreStatus.active) {
      console.log(`Exercise is started, sending to Plausible`);
      plausible('Exercise-Started', { props: { language: currentLanguage, length: size } });
    }
  }, [status, size, currentLanguage, plausible]);

  // Exercise set completed
  useEffect(() => {
    if (status === ExerciseStoreStatus.completed && prevStatus.current !== ExerciseStoreStatus.completed) {
      console.log(`Exercise comleted, sending to Plausible`, history.length);

      const correctAnswers = history.filter((exercise) => {
        return exercise.status === ExerciseStatus.completed && exercise.result?.score === 100;
      });

      const numberOfCorrectAnswers = correctAnswers.length;
      plausible('Exercise-Finished', {
        props: { language: currentLanguage, length: size, correct: numberOfCorrectAnswers },
      });
    }
  }, [status, size, currentLanguage, history, plausible]);

  // update prev status value
  useEffect(() => {
    prevStatus.current = status;
  }, [status]);
};
