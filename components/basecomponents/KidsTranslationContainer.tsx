import React from 'react';
import Image from 'next/image';
import { KidsTranslation } from './KidsTranslation';
import { useLanguage } from 'utils/useLanguageHook';
import { AudioPlayer } from 'utils/AudioPlayer';
import { useTranslation } from 'next-i18next';
import { Phrase } from 'utils/Phrase';

interface KidsTranslationContainerProps {
  translation: Phrase;
  searchText?: string;
  image: string;
}

/**
 *  Displays list of translations in opened collapse component
 *
 * @returns
 */
export const KidsTranslationsContainer = ({ translation, image }: KidsTranslationContainerProps): JSX.Element => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const { t } = useTranslation();

  const currentTranslation = translation.getTranslation(currentLanguage);
  const secondaryTranslation = translation.getTranslation(otherLanguage);

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-xl w-72 m-5 md:m-8 bg-[#f7e06a] max-h-[32rem]">
      <button
        className="w-72 h-72 relative bg-white"
        onClick={() => AudioPlayer.getInstance().playTextToSpeech(secondaryTranslation, otherLanguage)}
        aria-label={t('utils.play') + ' ' + secondaryTranslation}
      >
        <Image src={`/kids/${image}.svg`} layout="fill" sizes="100%" objectFit="cover" alt={translation.getTranslation('cs')} />
      </button>
      <div className="px-6 py-4">
        <KidsTranslation
          image={image}
          language={currentLanguage}
          transcription={translation.getTranscription(currentLanguage)}
          translation={currentTranslation}
        />
        <KidsTranslation
          image={image}
          language={otherLanguage}
          transcription={translation.getTranscription(otherLanguage)}
          translation={secondaryTranslation}
        />
      </div>
    </div>
  );
};
