import { Button } from 'components/basecomponents/Button';
import { ExerciseType, Exercise, Choice, ExerciseStatus, ExerciseStoreUtils } from './exerciseStore';
import { Phrase } from 'utils/getDataUtils';
import { useRef } from 'react';
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
  ({ uniqId, getCurrentLanguage, getOtherLanguage, selectChoice, resolveExercise, playAudio, playAudioSlow }: ExerciseStoreUtils) =>
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

    const resolve = (exercise: Exercise) => {
      /*all correct choices selected*/
      // return exercise.choices.every((choice) => choice.selected && choice.correct); // for multiple correct answers , cant use selectAndResolve
      return !!exercise.choices.find((choice) => choice.correct)?.selected; // finds first occurence !!!
    }; // what triggers resolve??? a) user with button to apply choices b) system after each choice selection

    const generateChoices = () =>
      choicesData.map(({ getText, getSoundUrl, correct }) => {
        const choiceId = uniqId();
        return {
          id: choiceId,
          getText,
          playAudio: () => playAudio(getSoundUrl()),
          selected: false,
          correct,
          select: () => {
            selectChoice(choiceId);
            resolveExercise(exerciseId);
          },
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
    };
  };

interface ChoiceButtonProps {
  onClick: () => void;
  text: string;
  correct: boolean;
  playAudio: () => Promise<void>;
}

const ChoiceButton = ({ onClick, text, correct, playAudio }: ChoiceButtonProps) => {
  const choiceRef = useRef(null);
  return (
    <Button
      ref={choiceRef}
      className="bg-primary-blue mr-3"
      text={text}
      onClick={async () => {
        if (choiceRef.current === null) return;
        animation.select(choiceRef.current);
        correct ? animation.selectCorrect(choiceRef.current) : animation.selectWrong(choiceRef.current);
        await playAudio();
        onClick(); // callback, should be last call in this method
      }}
    />
  );
};

// TODO: extend Button props with play method
interface PlayButtonProps {
  onClick: () => Promise<void>;
  text: string;
}

const PlayButton = ({ onClick, text }: PlayButtonProps) => {
  const btnRef = useRef(null);
  return (
    <Button
      className="bg-primary-blue mr-3"
      text={text}
      ref={btnRef}
      onClick={async () => {
        if (btnRef.current === null) return;
        const anim = animation.play(btnRef.current); // infinite loop animation
        await onClick();
        anim.restart();
        anim.pause();
      }}
    />
  );
};

interface ExerciseIdentificationComponentProps {
  exercise: ExerciseIdentification;
}

export const ExerciseIdentificationComponent = ({ exercise }: ExerciseIdentificationComponentProps) => {
  console.log('rerender');

  return (
    <div className="flex flex-col items-center">
      <div className="flex mb-3">
        <PlayButton onClick={exercise.playAudio} text="PlayAudio" />
        <PlayButton onClick={exercise.playAudioSlow} text="PlayAudioSlow" />
      </div>
      <div className="flex">
        {exercise.choices.map((choice) => (
          <ChoiceButton
            key={choice.id}
            text={choice.getText()}
            onClick={choice.select}
            correct={choice.correct}
            playAudio={choice.playAudio}
          />
        ))}
      </div>
    </div>
  );
};
