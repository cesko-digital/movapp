// QuizGame.js

import React, { FC, useState, useMemo, useCallback, useEffect } from 'react';
import { KidsTranslation } from 'components/basecomponents/KidsTranslation';
import ImageContainer from 'components/basecomponents/QuizGame/ImageContainer';
import { Phrase } from 'utils/getDataUtils';
import { useLanguage } from 'utils/useLanguageHook';
import { AudioPlayer } from 'utils/AudioPlayer';
import { shuffle } from 'utils/collectionUtils';
import { DictionaryDataObject, getKidsCategory } from 'utils/getDataUtils';
import phrases_CS from 'components/basecomponents/MemoryGame/memory-game-cs.json';
import phrases_PL from 'components/basecomponents/MemoryGame/memory-game-pl.json';
import phrases_SK from 'components/basecomponents/MemoryGame/memory-game-sk.json';
import { getCountryVariant } from 'utils/locales';
import { Phrase_deprecated } from 'utils/Phrase_deprecated';
import Confetti from './ConfetiAnimation';

type QuizProps = {
  dictionary: DictionaryDataObject;
};

const CHOICES_COUNT = 3;
const getRandomIndex = (len = CHOICES_COUNT) => Math.floor(Math.random() * len);
const GAME_NARRATION_PHRASES = {
  cs: phrases_CS,
  sk: phrases_SK,
  pl: phrases_PL,
};

enum Sound {
  Match = '/kids/memory-game/reward_sfx.mp3',
  DontMatch = '/kids/memory-game/card_flip.mp3',
}
const narrationPhrases = GAME_NARRATION_PHRASES[getCountryVariant()];

const Quiz: FC<QuizProps> = ({ dictionary }) => {
  const kidsCategory = useMemo(() => getKidsCategory(dictionary), [dictionary]);
  const [randomPhrases, setRandomPhrases] = useState<Phrase[]>();
  const [correctIndex, setCorrectIndex] = useState(getRandomIndex);
  const { currentLanguage, otherLanguage } = useLanguage();
  const [disabled, setDisabled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // force the state to only be set on the client-side, so no mismatches will occur.
    setRandomPhrases(shuffle(kidsCategory?.translations, CHOICES_COUNT));
  }, [dictionary, kidsCategory?.translations]);

  const playPhrase = useCallback(
    async (phrase: Phrase) => await AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(otherLanguage)),
    [otherLanguage]
  );
  useEffect(() => {
    if (randomPhrases?.[correctIndex]) playPhrase(randomPhrases[correctIndex]);
  }, [correctIndex, playPhrase, randomPhrases]);

  const playSounds = async (phrase: Phrase, key: 'good' | 'wrong', sound: Sound.Match | Sound.DontMatch) => {
    if (key === 'good') {
      // Show confetti animation when the answer is correct
      setShowConfetti(true);
    }
    const narrationPhrase = narrationPhrases[key][getRandomIndex(narrationPhrases[key].length)];
    const player: AudioPlayer = AudioPlayer.getInstance();
    await player.playSrc(sound);
    await playPhrase(phrase);
    return player.playTextToSpeech(new Phrase_deprecated(narrationPhrase).getTranslation(currentLanguage), currentLanguage);
  };

  const handleClick = async (phrase: Phrase, correct: boolean) => {
    setDisabled(true);
    if (correct) {
      await playSounds(phrase, 'good', Sound.Match);
      setRandomPhrases(shuffle(kidsCategory?.translations, CHOICES_COUNT));
      setCorrectIndex(getRandomIndex());
    } else {
      await playSounds(phrase, 'wrong', Sound.DontMatch);
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
      {showConfetti && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <Confetti />
        </div>
      )}
    </div>
  );
};

export default Quiz;
