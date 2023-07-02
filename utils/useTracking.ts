import { useEffect, useRef } from 'react';
import { useLanguage } from './useLanguageHook';
import { usePlausible } from 'next-plausible';
import { useExerciseStore } from 'components/basecomponents/Exercise/exerciseStore';
import { ExerciseStatus } from 'components/basecomponents/Exercise/exerciseStore';

export const useTracking = () => {
  const history = useExerciseStore((state) => state.history);
  const size = useExerciseStore((state) => state.size);
  const status = useExerciseStore((state) => state.status);

  const plausible = usePlausible();
  const lang = useLanguage();

  const hasBeenAlreadyRef = useRef(false); // Use useRef to prevent sending data to Plausible twice because of the double renders

  useEffect(() => {
    if (status === 'active' && history.length === 0 && !hasBeenAlreadyRef.current) {
      console.log(`Exercise is started, sending to Plausible`);
      plausible('Exercise-Started', { props: { language: lang.currentLanguage, length: size } });
      hasBeenAlreadyRef.current = true; // For one second, we prevent sending the data
      setTimeout(() => {
        hasBeenAlreadyRef.current = false; // After one second, we allow sending the data again
      }, 1000);
    } else if (history.length === size && status === 'completed') {
      console.log(`Exercise is finished, sending to Plausible`);
      const correctAnswers = history.filter((exercise) => {
        return exercise.status === ExerciseStatus.completed && exercise.result?.score === 100;
      });
      const numberOfCorrectAnswers = correctAnswers.length;
      plausible('Exercise-Finished', {
        props: { language: lang.currentLanguage, length: size, correct: numberOfCorrectAnswers },
      });
    }
  }, [size, history, status]);
};
