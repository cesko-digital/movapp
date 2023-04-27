import React from 'react';
import Image from "next/legacy/image";
import { KidsTranslation } from './KidsTranslation';
import { useLanguage } from 'utils/useLanguageHook';
import { AudioPlayer } from 'utils/AudioPlayer';
import { useTranslation } from 'next-i18next';
import { Phrase } from '../../utils/getDataUtils';

interface KidsTranslationContainerProps {
  phrase: Phrase;
  imageUrl: string | null;
  id?: string;
  searchText?: string;
}

/**
 *  Displays list of translations in opened collapse component
 *
 * @returns
 */
export const KidsTranslationsContainer = ({ phrase, imageUrl, id }: KidsTranslationContainerProps): JSX.Element => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const { t } = useTranslation();

  const currentTranslation = phrase.getTranslation(currentLanguage);
  const otherTranslation = phrase.getTranslation(otherLanguage);

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-xl w-72 m-5 md:m-8 bg-[#f7e06a] max-h-[34rem]">
      <button
        className="w-72 h-72 relative bg-white"
        onClick={() => AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(otherLanguage))}
        aria-label={t('utils.play') + ' ' + otherTranslation}
      >
        <Image id={id} src={imageUrl ?? ''} layout="fill" sizes="20vw" objectFit="cover" alt={phrase.getTranslation(otherLanguage)} />
      </button>
      <div className="px-6 py-4">
        <KidsTranslation
          language={currentLanguage}
          transcription={phrase.getTranscription(currentLanguage)}
          translation={currentTranslation}
          soundUrl={phrase.getSoundUrl(currentLanguage)}
        />
        <KidsTranslation
          language={otherLanguage}
          transcription={phrase.getTranscription(otherLanguage)}
          translation={otherTranslation}
          soundUrl={phrase.getSoundUrl(otherLanguage)}
        />
      </div>
    </div>
  );
};
