import { ExerciseType, Exercise, ExerciseStatus, ExerciseStoreUtils } from './exerciseStore';
import { Phrase } from 'utils/getDataUtils';

/* eslint-disable no-console */

interface ExerciseIdentificationOptions {
  level?: Exercise['level'];
}

const createExerciseIdentification = (
  phrases: Phrase[],
  { uniqId }: ExerciseStoreUtils,
  { level = 0, mode = 'audio' }: ExerciseIdentificationOptions & { mode: 'audio' | 'text' }
): Exercise => {
  const exerciseId = uniqId();
  const choices = phrases.sort(() => Math.random() - 0.5).map((phrase) => ({ id: uniqId(), phrase }));

  return {
    id: exerciseId,
    type: mode === 'audio' ? ExerciseType.audioIdentification : ExerciseType.textIdentification,
    status: ExerciseStatus.active,
    choices,
    correctChoiceId: choices[Math.floor(Math.random() * choices.length)].id,
    level,
    result: null,
  };
};

const createExerciseAudioIdentification = (
  phrases: Phrase[],
  utils: ExerciseStoreUtils,
  options: ExerciseIdentificationOptions
): Exercise => {
  return createExerciseIdentification(phrases, utils, { ...options, mode: 'audio' });
};

const createExerciseTextIdentification = (
  phrases: Phrase[],
  utils: ExerciseStoreUtils,
  options: ExerciseIdentificationOptions
): Exercise => {
  return createExerciseIdentification(phrases, utils, { ...options, mode: 'text' });
};

export const createExercise = (utils: ExerciseStoreUtils, type: ExerciseType, options: { level: number }, phrases: Phrase[]) => {
  const list = {
    [ExerciseType.audioIdentification]: () => createExerciseAudioIdentification(phrases, utils, options),
    [ExerciseType.textIdentification]: () => createExerciseTextIdentification(phrases, utils, options),
  };
  return list[type]();
};
