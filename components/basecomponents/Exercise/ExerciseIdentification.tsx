import { Button } from 'components/basecomponents/Button';
import {
  ExerciseType,
  Exercise,
  Choice,
  ExerciseStatus,
  ExerciseStoreUtils,
  ExerciseStoreActions,
  playAudio,
  playAudioSlow,
} from './exerciseStore';
import { Phrase } from 'utils/getDataUtils';
import { useRef, useState } from 'react';
import { animation } from './animation';

/* eslint-disable no-console */

export interface ExerciseIdentification extends Exercise {
  playAudio: () => Promise<void>;
  playAudioSlow: () => Promise<void>;
  choices: (Choice & {
    getText: () => string;
    playAudio: () => Promise<void>;
  })[];
}

export const createFactoryOfExerciseIdentification =
  ({
    uniqId,
    getCurrentLanguage,
    getOtherLanguage,
    getActiveExercise,
    selectChoice,
    exerciseCompleted,
    saveExerciseResult,
  }: ExerciseStoreUtils) =>
  (sourcePhrases: Phrase[]): ExerciseIdentification => {
    const filterOneWordPhrase = (phrase: Phrase) =>
      phrase.getTranslation(getCurrentLanguage()).split(' ').length + phrase.getTranslation(getOtherLanguage()).split(' ').length === 2;

    const exerciseId = uniqId();
    // filter feasible phrases for exercise, one word phrases

    const pickedPhrases = sourcePhrases
      // filter
      .filter(filterOneWordPhrase)
      // shuffle
      .sort(() => Math.random() - 0.5)
      // pick 4
      .slice(0, 4);

    console.log(pickedPhrases);

    /** input parameters */
    const getSoundUrl = () => pickedPhrases[0].getSoundUrl(getOtherLanguage());
    const extractChoiceData = (phrase: Phrase) => ({
      getText: () => phrase.getTranslation(getCurrentLanguage()),
      getSoundUrl: () => phrase.getSoundUrl(getOtherLanguage()),
    });
    const choicesData = pickedPhrases
      .map((phrase, index) => ({ ...extractChoiceData(phrase), correct: index === 0 }))
      // shuffle choices
      .sort(() => Math.random() - 0.5);

    const resolve = () => {
      const exercise = getActiveExercise() as ExerciseIdentification;
      if (exercise.id !== exerciseId) throw Error('trying to resolve another exercise');
      // resolve for difficulty level
      const resolveLevel: ((exercise: Exercise) => boolean)[] = [
        (exercise) => !!exercise.choices.find((choice) => choice.correct)?.selected,
      ];
      /*all correct choices selected when more choices are corect*/
      // return exercise.choices.every((choice) => choice.selected && choice.correct);
      if (!resolveLevel[exercise.level](exercise)) {
        return false;
      }
      const createResult: ((exercise: Exercise) => Exercise['result'])[] = [(exercise) => `exercise at level ${exercise.level} completed`];
      saveExerciseResult(exerciseId, createResult[exercise.level](exercise));
      return true;
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

    /** Exercise output object */
    return {
      id: exerciseId,
      type: ExerciseType.identification,
      status: ExerciseStatus.queued,
      playAudio: () => playAudio(getSoundUrl()),
      playAudioSlow: () => playAudioSlow(getSoundUrl()),
      choices: generateChoices(),
      resolve,
      completed: () => exerciseCompleted(exerciseId),
      result: '',
      level: 0,
    };
  };

interface ChoiceProps {
  select: Choice['select'];
  text: string;
  correct: boolean;
  playAudio: () => Promise<void>;
  disabled?: boolean;
  setButtonsDisabled: (val: boolean) => void;
  buttonsDisabled: boolean;
}

const Choice = ({ select, text, correct, playAudio, disabled = false, setButtonsDisabled, buttonsDisabled }: ChoiceProps) => {
  const choiceRef = useRef(null);
  return (
    <Button
      ref={choiceRef}
      className="bg-primary-blue mr-3"
      text={text}
      onClick={async () => {
        if (disabled) return;
        if (buttonsDisabled) return;
        if (choiceRef.current === null) return;
        setButtonsDisabled(true);
        animation.select(choiceRef.current);
        correct ? animation.selectCorrect(choiceRef.current) : animation.selectWrong(choiceRef.current);
        await playAudio();
        setButtonsDisabled(false);
        select();
      }} // callback, should be last call in this method
    />
  );
};

interface ExerciseIdentificationComponentProps {
  exercise: ExerciseIdentification;
  nextExercise: ExerciseStoreActions['nextExercise']; // FIXME: move to utils, exercise knows when to enable "next"
  // TODO: add exercise restart, code to factory
}

// FIXME: enable disable controls is reponsibility of component
export const ExerciseIdentificationComponent = ({ exercise }: ExerciseIdentificationComponentProps) => {
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  console.log('rerender');

  return (
    <div className="flex flex-col items-center">
      <div className="flex mb-3">
        <PlayButton play={exercise.playAudio} text="PlayAudio" />
        <PlayButton play={exercise.playAudioSlow} text="PlayAudioSlow" />
      </div>
      <div className="flex">
        {exercise.choices.map((choice) => (
          <Choice
            key={choice.id}
            text={choice.getText()}
            select={() => {
              choice.select();
              const resolved = exercise.resolve();
              if (resolved) {
                setButtonsDisabled(true);
                // run effects on completion
                // maybe give option to restart exercise
                exercise.completed();
              } else {
                // run effects
              }
            }}
            correct={choice.correct}
            playAudio={choice.playAudio}
            buttonsDisabled={buttonsDisabled}
            setButtonsDisabled={setButtonsDisabled}
          />
        ))}
      </div>
      {/* if exercise completed show result and button to continue */}
    </div>
  );
};

interface PlayButtonProps {
  play: () => Promise<void>;
  text: string;
  disabled?: boolean;
}

const PlayButton = ({ play, text, disabled = false }: PlayButtonProps) => {
  const [playing, setPlaying] = useState(false);
  const btnRef = useRef(null);
  return (
    <Button
      className="bg-primary-blue mr-3"
      text={text}
      ref={btnRef}
      onClick={async () => {
        if (btnRef.current === null) return;
        if (playing || disabled) return;
        const anim = animation.play(btnRef.current); // infinite loop animation
        setPlaying(true);
        await play();
        setPlaying(false);
        anim.restart();
        anim.pause();
      }}
    />
  );
};
