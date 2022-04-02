import React from 'react';
import Image from 'next/image';
import { KidsTranslation } from './KidsTranslation';
import { useLanguage } from 'components/utils/useLanguageHook';
import { AudioPlayer } from 'components/utils/audioUtils';

export interface Translation {
  cz_translation: string;
  ua_translation: string;
  ua_transcription: string;
  cz_transcription: string;
}

interface KidsTranslationContainerProps extends Translation {
  searchText?: string;
  image: string;
}

/**
 *  Displays list of translations in opened collapse component
 *
 * @returns
 */
export const KidsTranslationsContainer = ({
  cz_translation,
  ua_translation,
  ua_transcription,
  cz_transcription,
  image,
}: KidsTranslationContainerProps): JSX.Element => {
  const { currentLanguage, otherLanguage } = useLanguage();

  const languageTranslation = {
    uk: {
      translation: ua_translation,
      transcription: ua_transcription,
    },
    cs: {
      translation: cz_translation,
      transcription: cz_transcription,
    },
  };

  const currentTranslation = languageTranslation[currentLanguage].translation;
  const secondaryTranslation = languageTranslation[otherLanguage].translation;

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-xl w-72 m-5 md:m-8 bg-[#f7e06a] max-h-[32rem]">
      <button
        className="w-72 h-72 relative bg-white"
        onClick={() => AudioPlayer.getInstance().playTextToSpeech(secondaryTranslation, otherLanguage)}
        aria-label={'play ' + secondaryTranslation}
      >
        <Image src={`/kids/${image}.svg`} layout="fill" sizes="100%" objectFit="cover" alt={cz_translation} />
      </button>
      <div className="px-6 py-4">
        <KidsTranslation
          image={image}
          language={currentLanguage}
          transcription={languageTranslation[currentLanguage].transcription}
          translation={currentTranslation}
        />
        <KidsTranslation
          image={image}
          language={otherLanguage}
          transcription={languageTranslation[otherLanguage].transcription}
          translation={secondaryTranslation}
        />
      </div>
    </div>
  );
};
