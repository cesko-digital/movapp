// QuizGame.js

import React, { FC, useState, useMemo, useCallback, useEffect } from 'react';
import { KidsTranslation } from 'components/basecomponents/KidsTranslation';
import ImageContainer from 'components/basecomponents/QuizGame/ImageContainer';
import { Phrase } from 'utils/getDataUtils';
import { useLanguage } from 'utils/useLanguageHook';
import { AudioPlayer } from 'utils/AudioPlayer';
import { shuffle } from 'utils/collectionUtils';
import { DictionaryDataObject, getKidsCategory } from 'utils/getDataUtils';
import Confetti from './ConfetiAnimation';
import { usePlatform } from 'utils/usePlatform';
import { Platform } from '@types';
import { Category } from 'utils/narrator';
import useNarrator from 'utils/useNarrator';

type QuizProps = {
  dictionary: DictionaryDataObject;
};

const CHOICES_COUNT = 3;
const getRandomIndex = (len = CHOICES_COUNT) => Math.floor(Math.random() * len);

enum Sound {
  Match = '/kids/memory-game/reward_sfx.mp3',
  DontMatch = '/kids/memory-game/card_flip.mp3',
}

const playAudio = (str: string) => AudioPlayer.getInstance().playSrc(str);

const Quiz: FC<QuizProps> = ({ dictionary }) => {
  const kidsCategory = useMemo(() => getKidsCategory(dictionary), [dictionary]);
  const [randomPhrases, setRandomPhrases] = useState<Phrase[]>();
  const [correctIndex, setCorrectIndex] = useState(getRandomIndex);
  const { otherLanguage } = useLanguage();
  const [disabled, setDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const platform = usePlatform();
  const isKiosk = platform === Platform.KIOSK;

  useEffect(() => {
    // force the state to only be set on the client-side, so no mismatches will occur.
    setRandomPhrases(shuffle(kidsCategory?.translations, CHOICES_COUNT));
  }, [dictionary, kidsCategory?.translations]);

  const playPhrase = useCallback(async (phrase: Phrase) => await playAudio(phrase.getSoundUrl(otherLanguage)), [otherLanguage]);

  useEffect(() => {
    if (randomPhrases?.[correctIndex]) playPhrase(randomPhrases[correctIndex]);
  }, [correctIndex, playPhrase, randomPhrases]);

  const narrator = useNarrator(dictionary, playAudio);

  const playSounds = async (phrase: Phrase, correct: boolean) => {
    const [sound, category] = correct ? [Sound.Match, Category.good] : [Sound.DontMatch, Category.wrong];
    await playAudio(sound);
    await playPhrase(phrase);
    return narrator(category).playCurrentLanguage();
  };

  const handleClick = async (phrase: Phrase, correct: boolean) => {
    setDisabled(true);
    if (correct) {
      // Show confetti animation when the answer is correct
      setShowConfetti(true);
      await playSounds(phrase, correct);
      setRandomPhrases(shuffle(kidsCategory?.translations, CHOICES_COUNT));
      setCorrectIndex(getRandomIndex());
    } else {
      await playSounds(phrase, correct);
    }
    setDisabled(false);
    setShowConfetti(false);
  };

  if (!randomPhrases?.[correctIndex]) {
    return null;
  }
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row gap-8 place-self-center my-6">
        <KidsTranslation
          language={otherLanguage}
          transcription={randomPhrases[correctIndex].getTranscription(otherLanguage)}
          translation={randomPhrases[correctIndex].getTranslation(otherLanguage)}
          soundUrl={randomPhrases[correctIndex].getSoundUrl(otherLanguage)}
          isCard
        />
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-6 w-3/4 mx-auto">
        {randomPhrases.map((phrase, index) => {
          return (
            <ImageContainer
              key={phrase.getTranslation('uk')}
              phrase={phrase}
              onClick={handleClick}
              correct={index === correctIndex}
              disabled={disabled}
            />
          );
        })}
      </div>
      {showConfetti && isKiosk && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Confetti />
        </div>
      )}
    </div>
  );
};

export default Quiz;
