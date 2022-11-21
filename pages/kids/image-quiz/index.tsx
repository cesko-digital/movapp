import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { TranslationJSON } from 'utils/Phrase_deprecated';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionary, getKidsCategory, Phrase } from '../../../utils/getDataUtils';
import { getServerSideTranslations } from '../../../utils/localization';
import { useLanguage } from 'utils/useLanguageHook';
import { KidsTranslation } from 'components/basecomponents/KidsTranslation';
import { AudioPlayer } from 'utils/AudioPlayer';

export type KidsTranslation = TranslationJSON & { image: string };

interface ImageContainerProps {
  phrase: Phrase;
  imageUrl: string | null;
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const CHOICES_COUNT = 3;

const ImageQuizSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [phrases, setPhrases] = useState(getKidsCategory(dictionary)?.translations);

  useEffect(() => {
    const _phrases: Phrase[] = shuffle(getKidsCategory(dictionary)?.translations);
    setPhrases(_phrases);
  }, [dictionary]);
  const { t } = useTranslation();
  const { otherLanguage } = useLanguage();
  useEffect(() => {
    phrases?.[0] && AudioPlayer.getInstance().playSrc(phrases?.[0].getSoundUrl(otherLanguage));
  }, [phrases, otherLanguage]);

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>, phrase: Phrase, correctPhrase: Phrase) => {
    e.preventDefault();
    e.stopPropagation();
    if (phrase.getTranslation('uk') === correctPhrase.getTranslation('uk')) {
      console.log('correct');
      //setCss('border-green-50');
      // setTimeout(() => {
      //   setCss('');
      // }, 2000);
      setPhrases(shuffle(phrases));
    } else {
      console.log('try again');
      //setCss('border-red-50');
      // setTimeout(() => {
      //   setCss('');
      // }, 2000);
    }
  };

  if (!phrases?.[0]) {
    return null;
  }

  const otherTranslation = phrases[0].getTranslation(otherLanguage);

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <article className="flex flex-col m-auto items-center py-2 sm:py-4">
        <header>
          <KidsTranslation
            language={otherLanguage}
            transcription={phrases[0].getTranscription(otherLanguage)}
            translation={otherTranslation}
            soundUrl={phrases[0].getSoundUrl(otherLanguage)}
          />
        </header>
        <div className="flex flex-wrap justify-center px-2 sm:px-4">
          {phrases.slice(0, CHOICES_COUNT).map((phrase) => {
            return (
              <ImageContainer
                key={phrase.getTranslation('uk')}
                imageUrl={phrase.getImageUrl()}
                phrase={phrase}
                onClick={(e) => handleClick(e, phrase, phrases[0])}
              />
            );
          })}
        </div>
      </article>
    </div>
  );
};

const ImageContainer = ({ phrase, imageUrl, onClick }: ImageContainerProps): JSX.Element => {
  const { otherLanguage } = useLanguage();
  //const [css, setCss] = useState(''); TODO add className border-red-600 border-4

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-xl w-72 m-5 md:m-8 bg-[#f7e06a] max-h-[34rem]" onClick={onClick}>
      <button className="w-72 h-72 relative bg-white">
        <Image src={imageUrl ?? ''} layout="fill" sizes="100%" objectFit="cover" alt={phrase.getTranslation(otherLanguage)} />
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
