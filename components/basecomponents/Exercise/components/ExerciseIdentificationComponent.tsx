import { ExerciseStatus } from '../exerciseStore';
import React, { useRef, useState, useEffect } from 'react';
import { animation } from '../utils/animation';
import { PlayButton } from './PlayButton';
import { ChoiceComponent } from './ChoiceComponent';
import { NextButton } from './NextButton';
import { ExerciseIdentification } from '../ExerciseIdentification';

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
    if (exercise.mode === 'audio') exercise.playAudio();
    return () => {
      if (ref !== null) animation.fade(ref);
    };
    /* adding exercise to deps causes to run useEffect on every change of exercise,
     one workaround would be import exercise from store directly and remove it from props */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={exRef} className="flex flex-col items-center opacity-0">
      <p>Level: {exercise.level}</p>
      <div className="flex mb-3">
        {(exercise.mode === 'audio' || exercise.status === ExerciseStatus.completed) && (
          <>
            <PlayButton play={exercise.playAudio} text="PlayAudio" />
            <PlayButton play={exercise.playAudioSlow} text="PlayAudioSlow" />
          </>
        )}
        {(exercise.mode === 'text' || exercise.status === ExerciseStatus.completed) && <p>{exercise.getText()}</p>}
      </div>
      <div className="flex mb-3">
        {exercise.choices.map((choice) => (
          <ChoiceComponent
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
        <NextButton
          onClick={async () => {
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
