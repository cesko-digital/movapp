import { Button } from 'components/basecomponents/Button';
import { ExerciseType, Exercise, Choice, ExerciseStatus, ExerciseStoreUtils, playAudio, playAudioSlow } from './exerciseStore';
import { Phrase } from 'utils/getDataUtils';
import { useRef, useState, useEffect } from 'react';
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
    getExercise,
    selectChoice,
    exerciseCompleted,
    saveExerciseResult,
    setExerciseProp,
    nextExercise,
  }: ExerciseStoreUtils) =>
  (sourcePhrases: Phrase[]): ExerciseIdentification => {
    const filterOneWordPhrase = (phrase: Phrase) =>
      phrase.getTranslation(getCurrentLanguage()).split(' ').length + phrase.getTranslation(getOtherLanguage()).split(' ').length === 2;

    const exerciseId = uniqId();

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
      const exercise = getExercise(exerciseId) as ExerciseIdentification;
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
      setExerciseProp(exerciseId, 'choices', (result) => {
        console.log(`old result is ${result}`);
        return result;
      });
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
      next: nextExercise,
      result: '',
      level: 0,
    };
  };

interface ChoiceProps {
  text: string;
  correct: boolean;
  playAudio: () => Promise<void>;
  disabled?: boolean;
  onClickStarted: () => void;
  onClickFinished: () => void;
}

const Choice = ({ text, correct, playAudio, disabled = false, onClickStarted, onClickFinished }: ChoiceProps) => {
  const choiceRef = useRef(null);
  return (
    <Button
      ref={choiceRef}
      className="bg-primary-blue mr-3"
      text={text}
      onClick={async () => {
        if (disabled) return;
        if (choiceRef.current === null) return;
        onClickStarted();
        playAudio();
        await animation.select(choiceRef.current).finished;
        correct ? await animation.selectCorrect(choiceRef.current).finished : await animation.selectWrong(choiceRef.current).finished;
        onClickFinished();
      }}
    />
  );
};

interface ExerciseIdentificationComponentProps {
  exercise: ExerciseIdentification;
  // TODO: add exercise restart
}

export const ExerciseIdentificationComponent = ({ exercise }: ExerciseIdentificationComponentProps) => {
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const exRef = useRef(null);

  useEffect(() => {
    if (exRef.current !== null) animation.show(exRef.current);
  }, []);

  console.log('rerender');

  return (
    <div ref={exRef} className="flex flex-col items-center opacity-0">
      <div className="flex mb-3">
        <PlayButton play={exercise.playAudio} text="PlayAudio" disabled={buttonsDisabled} />
        <PlayButton play={exercise.playAudioSlow} text="PlayAudioSlow" disabled={buttonsDisabled} />
      </div>
      <div className="flex mb-3">
        {exercise.choices.map((choice) => (
          <Choice
            key={choice.id}
            text={choice.getText()}
            correct={choice.correct}
            playAudio={choice.playAudio}
            disabled={buttonsDisabled}
            onClickStarted={() => setButtonsDisabled(true)}
            onClickFinished={() => {
              choice.select();
              const resolved = exercise.resolve();
              if (resolved) {
                // run effects on completion
                // maybe give option to restart exercise
                exercise.completed();
              } else {
                setButtonsDisabled(false);
                // run effects
              }
            }}
          />
        ))}
      </div>
      {exercise.status === ExerciseStatus.completed && (
        <ExerciseControls
          next={async () => {
            if (exRef.current === null) return;
            await animation.fade(exRef.current, 300).finished;
            exercise.next();
          }}
        />
      )}
    </div>
  );
};

interface ExerciseControlsProps {
  next: Exercise['next'];
}

const ExerciseControls = ({ next }: ExerciseControlsProps) => (
  <div className="flex mb-3">
    <Button className="bg-primary-blue mr-3" text="next" onClick={next} />
  </div>
);

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
