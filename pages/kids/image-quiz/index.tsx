import { useTranslation } from 'next-i18next';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Phrase_deprecated } from 'utils/Phrase_deprecated';
import { getCountryVariant } from 'utils/locales';
import SEO from 'components/basecomponents/SEO';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionary, getKidsCategory, Phrase } from '../../../utils/getDataUtils';
import { getServerSideTranslations } from '../../../utils/localization';
import { useLanguage } from 'utils/useLanguageHook';
import { KidsTranslation } from 'components/basecomponents/KidsTranslation';
import { AudioPlayer } from 'utils/AudioPlayer';
import phrases_CS from 'components/basecomponents/MemoryGame/memory-game-cs.json';
import phrases_PL from 'components/basecomponents/MemoryGame/memory-game-pl.json';
import phrases_SK from 'components/basecomponents/MemoryGame/memory-game-sk.json';
import styles from './imageStyle.module.css';
import { shuffle } from 'utils/collectionUtils';

interface ImageContainerProps {
  phrase: Phrase;
  onClick: (phrase: Phrase, correct: boolean) => Promise<void>;
  correct: boolean;
  disabled: boolean;
}

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

const ImageQuizSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const kidsCategory = useMemo(() => getKidsCategory(dictionary), [dictionary]);
  const [randomPhrases, setRandomPhrases] = useState<Phrase[]>();
  const [correctIndex, setCorrectIndex] = useState(getRandomIndex);
  const { t } = useTranslation();
  const { currentLanguage, otherLanguage } = useLanguage();
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    // force the state to only be set on the client-side, so no mismatches will occur.
    setRandomPhrases(shuffle(kidsCategory?.translations, CHOICES_COUNT));
  }, [dictionary, kidsCategory?.translations]);
  const playPhrase = useCallback(
    async (phrase: Phrase) => await AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(otherLanguage)),
    [otherLanguage]
  );
  useEffect(() => {
    randomPhrases?.[correctIndex] && playPhrase(randomPhrases[correctIndex]);
  }, [correctIndex, playPhrase, randomPhrases]);

  const playSounds = async (phrase: Phrase, key: 'good' | 'wrong', sound: Sound.Match | Sound.DontMatch) => {
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
  };

  if (!randomPhrases?.[correctIndex]) {
    return null;
  }

  return (
    <div className="h-screen bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_imagequiz_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_imagequiz_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <article className="flex flex-col h-screen items-center space-y-4 py-4">
        <header>
          <KidsTranslation
            language={otherLanguage}
            transcription={randomPhrases[correctIndex].getTranscription(otherLanguage)}
            translation={randomPhrases[correctIndex].getTranslation(otherLanguage)}
            soundUrl={randomPhrases[correctIndex].getSoundUrl(otherLanguage)}
          />
        </header>
        <div className="grid grid-cols-3 gap-2 sm:gap-6 w-3/4">
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
      </article>
    </div>
  );
};

const ImageContainer = ({ phrase, onClick, correct, disabled }: ImageContainerProps): JSX.Element => {
  const { otherLanguage } = useLanguage();
  const [className, setClassName] = useState('');

  return (
    <div
      className={`aspect-square w-full rounded-2xl overflow-hidden shadow-xl bg-white ${className}`}
      onClick={
        !disabled
          ? () => {
              setClassName(correct ? styles.match : styles.dontMatch);
              onClick(phrase, correct);
            }
          : undefined
      }
      onAnimationEnd={() => setClassName('')}
    >
      <button className={'w-full h-full relative'}>
        <Image src={phrase.getImageUrl() ?? ''} layout="fill" sizes="100%" objectFit="cover" alt={phrase.getTranslation(otherLanguage)} />
      </button>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ dictionary: DictionaryDataObject }> = async ({ locale }) => {
  const dictionary = await fetchDictionary();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      dictionary,
      ...localeTranslations,
    },
  };
};

export default ImageQuizSection;
