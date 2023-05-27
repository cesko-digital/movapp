import { ExerciseType, Exercise, ExerciseStatus, ExerciseStoreUtils, CONFIG } from './exerciseStore';
import { Phrase } from 'utils/getDataUtils';

/* eslint-disable no-console */
export const isExerciseAudioIdentification = (ex: Exercise) => ex.type === ExerciseType.audioIdentification;

export const isExerciseTextIdentification = (ex: Exercise) => ex.type === ExerciseType.textIdentification;

export interface ExerciseIdentificationOptions {
  level?: Exercise['level'];
  mode?: 'audio' | 'text';
}

export const createFactoryOfExerciseIdentification =
  ({ uniqId, phraseFilters, getFallbackPhrases }: ExerciseStoreUtils, { level = 0, mode = 'audio' }: ExerciseIdentificationOptions) =>
  (sourcePhrases: Phrase[]): Exercise => {
    const exerciseId = uniqId();

    const pickedPhrases = phraseFilters.greatPhraseFilter(level, sourcePhrases, getFallbackPhrases(), CONFIG[level]);
    const choices = pickedPhrases.sort(() => Math.random() - 0.5).map((phrase) => ({ id: uniqId(), phrase }));

    /** Exercise output object has tailored actions to lighten up UI logic */
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
