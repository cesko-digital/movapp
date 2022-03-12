import React from 'react';
import { createHighlightedText } from '../../utils/createHighlightedText';
import { useTranslation } from 'next-i18next';
import { Translation } from './Translation';

export interface Translation {
  cz_translation: string;
  ua_translation: string;
  ua_transcription: string;
  cz_transcription: string;
}

interface TranslationContainerProps extends Translation {
  searchText: string;
  setPlayer: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>;
  player: HTMLAudioElement | null;
}

/**
 *  Displays list of translations in opened collapse component
 *
 * @returns
 */
export const TranslationContainer = ({
  cz_translation,
  ua_translation,
  ua_transcription,
  cz_transcription,
  searchText,
  setPlayer,
  player,
}: TranslationContainerProps): JSX.Element => {
  const czTranslation = createHighlightedText(cz_translation, searchText);
  const uaTranslation = createHighlightedText(ua_translation, searchText);
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const secondaryLanguage = currentLanguage === 'ua' ? 'cz' : 'ua';

  const languageTranslation = {
    ua: {
      translation: uaTranslation,
      transcription: ua_transcription,
    },
    cz: {
      translation: czTranslation,
      transcription: cz_transcription,
    },
  };

  return (
    <div className="sm:grid sm:grid-cols-[50%_1px_50%]   sm:items-center  p-2  border-b-slate-200 bg-primary-white">
      {/* CZ translation  */}
      <Translation
        player={player}
        setPlayer={setPlayer}
        transcription={languageTranslation[currentLanguage as 'ua' | 'cz'].transcription}
        translation={languageTranslation[currentLanguage as 'ua' | 'cz'].translation}
      />
      {/* Divider */}
      <div className="w-full h-0 sm:h-full sm:py-2 justify-self-center sm:w-0 border-1  border-[#D2D2D2]"></div>
      {/* UA translation  */}
      <Translation
        player={player}
        setPlayer={setPlayer}
        transcription={languageTranslation[secondaryLanguage].transcription}
        translation={languageTranslation[secondaryLanguage].translation}
      />
    </div>
  );
};
