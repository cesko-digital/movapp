import { shuffleArray, getRandomItem } from 'utils/collectionUtils';
import { ExerciseType, Exercise, ExerciseStatus, ExerciseStoreUtils } from './exerciseStore';
import { Phrase } from 'utils/getDataUtils';

export const createExercise = (
  { uniqId }: ExerciseStoreUtils,
  type: ExerciseType,
  { level }: { level: number },
  phrases: Phrase[]
): Exercise => {
  const exerciseId = uniqId();
  const choices = phrases.map((phrase) => ({ id: uniqId(), phrase }));

  return {
    id: exerciseId,
    type,
    status: ExerciseStatus.active,
    choices: shuffleArray(choices),
    correctChoiceId: getRandomItem(choices).id,
    level,
    result: null,
  };
};
