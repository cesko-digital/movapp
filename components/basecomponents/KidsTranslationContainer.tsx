import React from 'react';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { KidsTranslation } from './KidsTranslation';
import { Language } from '../../data/locales';
import { handleTranslationAudioPlay } from 'components/libs/Player';

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

  const handlePlayer = (language: Language, translation: string) => {
    const audio = handleTranslationAudioPlay(language, translation, player);
    setPlayer(audio);
  };

  return (
    <div className="max-w-sm rounded-2xl overflow-hidden shadow-xl w-72 m-5 md:m-8 bg-[#f7e06a] max-h-[32rem]">
      <button
        className="w-72 h-72 relative bg-white"
        onClick={() => handlePlayer(currentLanguage === 'cs' ? 'uk' : 'cs', currentLanguage === 'cs' ? ua_translation : cz_translation)}
        aria-label="play"
      >
        <Image src={`/${image}.svg`} layout="fill" sizes="100%" objectFit="cover" alt={cz_translation} />
      </button>
      <div className="px-6 py-4 ">
        <KidsTranslation
          image={image}
          currentLanguage={currentLanguage}
          onHandlePlayer={() => handlePlayer(currentLanguage, languageTranslation[currentLanguage].translation)}
          transcription={languageTranslation[currentLanguage].transcription}
          translation={languageTranslation[currentLanguage].translation}
        />
        <KidsTranslation
          image={image}
          currentLanguage={secondaryLanguage}
          onHandlePlayer={() => handlePlayer(secondaryLanguage, languageTranslation[secondaryLanguage].translation)}
          transcription={languageTranslation[secondaryLanguage].transcription}
          translation={languageTranslation[secondaryLanguage].translation}
        />
      </div>
    </div>
  );
};
