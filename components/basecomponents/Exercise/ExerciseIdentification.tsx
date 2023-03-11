import { Button } from 'components/basecomponents/Button';
import { ExerciseType, Exercise, Choice, ExerciseStatus, ExerciseStoreUtils, playAudio, playAudioSlow } from './exerciseStore';
import { Phrase } from 'utils/getDataUtils';
import React, { useRef, useState, useEffect } from 'react';
import { animation } from './utils/animation';

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
    exerciseResolved,
    exerciseCompleted,
    setExerciseResult,
    nextExercise,
    filterOneWordPhrase,
    resolveMethods,
  }: ExerciseStoreUtils) =>
  (sourcePhrases: Phrase[]): ExerciseIdentification => {
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
      const exercise = getExercise() as ExerciseIdentification;
      // resolve for difficulty level: [level0, level1, ...]
      const resolveLevel = [resolveMethods.oneCorrect];

      if (!resolveLevel[exercise.level](exercise)) {
        return false;
      }
      // TODO: generalize and extract
      const createResult = [(exercise: Exercise) => `exercise at level ${exercise.level} completed`];
      setExerciseResult(createResult[exercise.level](exercise));
      exerciseResolved();
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

    /** Exercise output object has tailored actions to lighten up UI logic */
    return {
      id: exerciseId,
      type: ExerciseType.identification,
      status: ExerciseStatus.active,
      playAudio: () => playAudio(getSoundUrl()),
      playAudioSlow: () => playAudioSlow(getSoundUrl()),
      choices: generateChoices(),
      resolve,
      completed: exerciseCompleted,
      next: nextExercise,
      result: '',
      level: 0,
    };
  };

/**
 * Exercise component is UI for exercise object
 * It handles user intereactions. It inactivates certain controls at certain situations.
 * It has set of prepared actions.
 * It is responsible for taking valid actions only.
 *
 * Inactive controls ensures correct operation.
 * Disabled controls inform user.
 *
 * Operation of this Exercise:
 * 1. Exercise appears and sound is played !!! IOS autoplay problem
 * 2. User clicks on choice. It is set as selected. Then it try to resolve exercise.
 * 2a. If resolved: Result prop is set and exercise status is changed to resolved.
 * 2b. If not resolved: It is waiting for user to select another choice.
 * 3. Then it's status is changed to complete.
 * 4. Button NEXT appears.
 */

interface ExerciseIdentificationComponentProps {
  exercise: ExerciseIdentification;
}

export const ExerciseIdentificationComponent = ({ exercise }: ExerciseIdentificationComponentProps) => {
  const [buttonsInactive, setButtonsInactive] = useState(false);
  const exRef = useRef(null);

  // Animation on component mount and unmount
  useEffect(() => {
    const ref = exRef.current;
    if (ref !== null) animation.show(ref);
    return () => {
      if (ref !== null) animation.fade(ref);
    };
  }, []);

  return (
    <div ref={exRef} className="flex flex-col items-center opacity-0">
      <div className="flex mb-3">
        <PlayButton play={exercise.playAudio} text="PlayAudio" inactive={buttonsInactive} />
        <PlayButton play={exercise.playAudioSlow} text="PlayAudioSlow" inactive={buttonsInactive} />
      </div>
      <div className="flex mb-3">
        {exercise.choices.map((choice) => (
          <Choice
            key={choice.id}
            text={choice.getText()}
            correct={choice.correct}
            inactive={buttonsInactive}
            onClickStarted={() => {
              setButtonsInactive(true);
              choice.playAudio(); // await ommited cause resolving of playAudio has significant delay
            }}
            onClickFinished={async () => {
              choice.select();
              const resolved = exercise.resolve();
              if (resolved) {
                // run effects
                exercise.completed();
              } else {
                // run effects
                setButtonsInactive(false);
              }
            }}
          />
        ))}
      </div>
      {exercise.status === ExerciseStatus.completed && (
        <ExerciseControls
          next={async () => {
            if (exRef.current === null) return;
            // run effects
            await animation.fade(exRef.current, 300, 500).finished;
            exercise.next();
          }}
        />
      )}
    </div>
  );
};

// TODO: Export to common components
interface ChoiceProps {
  text: string;
  correct: boolean;
  inactive?: boolean;
  onClickStarted: () => void;
  onClickFinished: () => void;
}

const Choice = ({ text, correct, inactive = false, onClickStarted, onClickFinished }: ChoiceProps) => {
  const choiceRef = useRef(null);

  return (
    <Button
      ref={choiceRef}
      className="bg-primary-blue mr-3"
      text={text}
      onClick={async () => {
        if (inactive) return;
        if (choiceRef.current === null) return;
        onClickStarted();
        await animation.select(choiceRef.current).finished;
        correct ? await animation.selectCorrect(choiceRef.current).finished : await animation.selectWrong(choiceRef.current).finished;
        onClickFinished();
      }}
    />
  );
};

// TODO: Export to common components
interface ExerciseControlsProps {
  next: Exercise['next'];
}

const ExerciseControls = ({ next }: ExerciseControlsProps) => {
  const btnRef = useRef(null);
  return (
    <div className="flex mb-3">
      <Button
        ref={btnRef}
        className="bg-primary-blue mr-3"
        text="next"
        onClick={async () => {
          if (btnRef.current === null) return;
          await animation.select(btnRef.current).finished;
          next();
        }}
      />
    </div>
  );
};

// TODO: Export to common components
interface PlayButtonProps {
  play: () => Promise<void>;
  text: string;
  inactive?: boolean;
}

const PlayButton = ({ play, text, inactive = false }: PlayButtonProps) => {
  const [playing, setPlaying] = useState(false);
  const btnRef = useRef(null);
  return (
    <Button
      className="bg-primary-blue mr-3"
      text={text}
      ref={btnRef}
      onClick={async () => {
        if (btnRef.current === null) return;
        if (playing || inactive) return;
        const anim = animation.breathe(btnRef.current); // infinite loop animation
        setPlaying(true);
        await play();
        setPlaying(false);
        anim.restart();
        anim.pause();
      }}
    />
  );
};
