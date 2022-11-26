import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Phrase_deprecated, TranslationJSON } from 'utils/Phrase_deprecated';
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

export type KidsTranslation = TranslationJSON & { image: string };

interface ImageContainerProps {
  phrase: Phrase;
  onClick: (e: React.MouseEvent, phrase: Phrase, correct: boolean) => void;
  correct: boolean;
}

const CHOICES_COUNT = 3;

const getRandomIndex = (len = CHOICES_COUNT) => Math.floor(Math.random() * len);

const GAME_NARRATION_PHRASES = {
  cs: phrases_CS,
  sk: phrases_SK,
  pl: phrases_PL,
};

const matchSound = '/kids/image-quiz/positive.mp3';
const dontMatchSound = '/kids/image-quiz/negative.mp3';
const text = GAME_NARRATION_PHRASES[getCountryVariant()];

const ImageQuizSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [phrases, setPhrases] = useState<Phrase[]>();
  const [correctIndex, setCorrectIndex] = useState(getRandomIndex);
  const { t } = useTranslation();
  const { currentLanguage, otherLanguage } = useLanguage();

  useEffect(() => {
    const _phrases: Phrase[] = shuffle(getKidsCategory(dictionary)?.translations);
    setPhrases(_phrases);
  }, [dictionary]);

  useEffect(() => {
    phrases?.[correctIndex] && AudioPlayer.getInstance().playSrc(phrases[correctIndex].getSoundUrl(otherLanguage));
  });

  const handleClick = (e: React.MouseEvent, phrase: Phrase, correct: boolean) => {
    e.preventDefault();
    e.stopPropagation();

    if (correct) {
      const textGood = text.good[getRandomIndex(text.good.length)];
      AudioPlayer.getInstance()
        .playSrc(matchSound)
        .then(
          async () =>
            await AudioPlayer.getInstance().playTextToSpeech(
              new Phrase_deprecated(textGood).getTranslation(currentLanguage),
              currentLanguage
            )
        );
      setTimeout(() => {
        setPhrases(shuffle(phrases));
        setCorrectIndex(getRandomIndex());
      }, 4000);
    } else {
      const textWrong = text.wrong[getRandomIndex(text.wrong.length)];
      AudioPlayer.getInstance()
        .playSrc(dontMatchSound)
        .then(
          async () =>
            await AudioPlayer.getInstance().playTextToSpeech(
              new Phrase_deprecated(textWrong).getTranslation(currentLanguage),
              currentLanguage
            )
        );
    }
  };

  if (!phrases?.[correctIndex]) {
    return null;
  }

  const otherTranslation = phrases[correctIndex].getTranslation(otherLanguage);

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_imagequiz_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_imagequiz_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <article className="flex flex-col m-auto items-center py-2 sm:py-4">
        <header>
          <KidsTranslation
            language={otherLanguage}
            transcription={phrases[correctIndex].getTranscription(otherLanguage)}
            translation={otherTranslation}
            soundUrl={phrases[correctIndex].getSoundUrl(otherLanguage)}
          />
        </header>
        <div className="flex flex-wrap justify-center px-2 sm:px-4">
          {phrases.slice(0, CHOICES_COUNT).map((phrase, index) => {
            return (
              <ImageContainer key={phrase.getTranslation('uk')} phrase={phrase} onClick={handleClick} correct={index === correctIndex} />
            );
          })}
        </div>
      </article>
    </div>
  );
};

const ImageContainer = ({ phrase, onClick, correct }: ImageContainerProps): JSX.Element => {
  const { otherLanguage } = useLanguage();
  const [className, setClassName] = useState('');

  return (
    <div
      className={`max-w-sm rounded-2xl overflow-hidden shadow-xl w-72 m-5 md:m-8 bg-[#f7e06a] max-h-[34rem] ${className}`}
      onClick={(e) => {
        setClassName(correct ? styles.match : styles.dontMatch);
        onClick(e, phrase, correct);
      }}
    >
      <button className="w-72 h-72 relative bg-white">
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

const shuffle = (array: Phrase[] = []) => {
  const arrayCopy = [...array];
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
};

export default ImageQuizSection;
