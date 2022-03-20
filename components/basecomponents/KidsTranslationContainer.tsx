import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { KidsTranslation } from './KidsTranslation';
import { Language } from '../../data/locales';

export interface Translation {
  cz_translation: string;
  ua_translation: string;
  ua_transcription: string;
  cz_transcription: string;
}

interface KidsTranslationContainerProps extends Translation {
  searchText?: string;
  image: string;
  setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
  player: HTMLAudioElement | null;
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
  setPlayer,
  player,
}: KidsTranslationContainerProps): JSX.Element => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language as Language;
  const secondaryLanguage: Language = currentLanguage === 'uk' ? 'cs' : 'uk';

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

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-xl w-72 m-5 md:m-8 bg-[#f7e06a] max-h-[32rem]">
      <div className="w-72 h-72 relative bg-white">
        <Image src={`/${image}.svg`} layout="fill" sizes="100%" objectFit="cover" alt={cz_translation} />
      </div>
      <div className="px-6 py-4 ">
        <KidsTranslation
          image={image}
          currentLanguage={currentLanguage}
          player={player}
          setPlayer={setPlayer}
          transcription={languageTranslation[currentLanguage].transcription}
          translation={languageTranslation[currentLanguage].translation}
        />
        <KidsTranslation
          image={image}
          currentLanguage={secondaryLanguage}
          player={player}
          setPlayer={setPlayer}
          transcription={languageTranslation[secondaryLanguage].transcription}
          translation={languageTranslation[secondaryLanguage].translation}
        />
      </div>
    </div>
  );
};
