import { ExerciseType, Exercise, Choice, ExerciseStatus, ExerciseStoreUtils, playAudio, playAudioSlow, CONFIG } from './exerciseStore';
import { Phrase } from 'utils/getDataUtils';

/* eslint-disable no-console */

export const isExerciseAudioIdentification = (ex: Exercise) =>
  ex.type === ExerciseType.identification && (ex as ExerciseIdentification).mode === 'audio';

export const isExerciseTextIdentification = (ex: Exercise) =>
  ex.type === ExerciseType.identification && (ex as ExerciseIdentification).mode === 'text';

export interface ExerciseIdentification extends Exercise {
  playAudio: () => Promise<void>;
  playAudioSlow: () => Promise<void>;
  getText: () => string;
  mode: 'audio' | 'text';
  choices: (Choice & {
    getText: () => string;
    playAudio: () => Promise<void>;
  })[];
}

export interface ExerciseIdentificationOptions {
  level?: Exercise['level'];
  mode?: ExerciseIdentification['mode'];
}

export const createFactoryOfExerciseIdentification =
  (
    {
      uniqId,
      getCurrentLanguage,
      getOtherLanguage,
      getExercise,
      selectChoice,
      exerciseResolved,
      exerciseCompleted,
      nextExercise,
      phraseFilters,
      resolveMethods,
      resultMethods,
      getFallbackPhrases,
    }: ExerciseStoreUtils,
    { level = 0, mode = 'audio' }: ExerciseIdentificationOptions
  ) =>
  (sourcePhrases: Phrase[]): ExerciseIdentification => {
    const exerciseId = uniqId();

    const pickPhrases = (phrases: Phrase[], level: number) =>
      phrases
        .filter(phraseFilters.wordLimitForLevel[level])
        // remove duplicates
        .filter((phrase, index, array) => array.findIndex(phraseFilters.equalPhrase(phrase)) === index)
        // shuffle
        .sort(() => Math.random() - 0.5)
        // pick specified count
        .slice(0, CONFIG[level].choiceLimit);

    let pickedPhrases = pickPhrases(sourcePhrases, level);

    if (pickedPhrases.length < CONFIG[level].choiceLimit) {
      // add fallback phrases for same level
      pickedPhrases = pickedPhrases
        .concat(pickPhrases(getFallbackPhrases(), level))
        .slice(0, CONFIG[level].choiceLimit)
        .sort(() => Math.random() - 0.5);
    }

    /** input parameters */
    const getSoundUrl = () => pickedPhrases[0].getSoundUrl(getOtherLanguage());
    const getText = () => pickedPhrases[0].getTranslation(getOtherLanguage());
    const extractChoiceData = (phrase: Phrase) => ({
      getText: () => phrase.getTranslation(getCurrentLanguage()),
      getSoundUrl: () => phrase.getSoundUrl(getOtherLanguage()),
    });

    const choicesData = pickedPhrases
      .map((phrase, index) => ({ ...extractChoiceData(phrase), correct: index === 0 }))
      // shuffle choices
      .sort(() => Math.random() - 0.5);

    const resolve = () => {
      const exercise = getExercise() as ExerciseIdentification;
      // resolve for difficulty level: [level0, level1, ...]
      // const resolveLevel = [resolveMethods.oneCorrect];

      // if (!resolveLevel[exercise.level](exercise)) {
      //   return false;
      // }
      if (!resolveMethods.oneCorrect(exercise)) {
        return false;
      }

      exerciseResolved();
      return true;
    };

    const getResult = () => {
      const exercise = getExercise() as ExerciseIdentification;
      if (exercise.status !== ExerciseStatus.resolved && exercise.status !== ExerciseStatus.completed)
        throw Error(`Can't make result on unresolved exercise`);
      // create result for difficulty level: [level0, level1, ...]
      // const createResult = [resultMethods.selectedCorrect];
      // return createResult[exercise.level](exercise);
      return resultMethods.selectedCorrect(exercise);
    };

    const generateChoices = () =>
      choicesData.map(({ getText, getSoundUrl, correct }) => {
        const choiceId = uniqId();
        return {
          id: choiceId,
          getText,
          playAudio: () => playAudio(getSoundUrl()),
          selected: false,
          correct,
          select: () => selectChoice(choiceId),
        };
      });

    /** Exercise output object has tailored actions to lighten up UI logic */
    return {
      id: exerciseId,
      type: ExerciseType.identification,
      mode,
      status: ExerciseStatus.active,
      playAudio: () => playAudio(getSoundUrl()),
      playAudioSlow: () => playAudioSlow(getSoundUrl()),
      getText,
      choices: generateChoices(),
      resolve,
      getResult,
      completed: exerciseCompleted,
      next: nextExercise,
      level,
    };
  };
