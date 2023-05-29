import { ExerciseType, Exercise, ExerciseStatus, ExerciseStoreUtils } from './exerciseStore';
import { Phrase } from 'utils/getDataUtils';
import { CONFIG } from './exerciseStoreConfig';
import { greatPhraseFilter } from './utils/phraseFilters';

/* eslint-disable no-console */

interface ExerciseIdentificationOptions {
  level?: Exercise['level'];
}

const createExerciseIdentification = (
  sourcePhrases: Phrase[],
  { uniqId, getCurrentLanguage, getFallbackPhrases }: ExerciseStoreUtils,
  { level = 0, mode = 'audio' }: ExerciseIdentificationOptions & { mode: 'audio' | 'text' }
): Exercise => {
  const exerciseId = uniqId();
  const pickedPhrases = greatPhraseFilter(getCurrentLanguage, level, sourcePhrases, getFallbackPhrases(), CONFIG[level]);
  const choices = pickedPhrases.sort(() => Math.random() - 0.5).map((phrase) => ({ id: uniqId(), phrase }));

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

export const createExercise = (
  utils: ExerciseStoreUtils,
  type: ExerciseType,
  options: { level: number }
): ((phrases: Phrase[]) => Exercise) => {
  const list = {
    [ExerciseType.audioIdentification]: (phrases: Phrase[]) => createExerciseAudioIdentification(phrases, utils, options),
    [ExerciseType.textIdentification]: (phrases: Phrase[]) => createExerciseTextIdentification(phrases, utils, options),
  };
  return list[type];
};
