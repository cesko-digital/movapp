import { Translation } from './Translation';
import { Language } from 'data/locales';
import { forwardRef } from 'react';
import { useLanguage } from 'components/utils/useLanguageHook';

export interface TranslationType {
  cz_translation: string;
  ua_translation: string;
  ua_transcription: string;
  cz_transcription: string;
}

interface TranslationContainerProps extends TranslationType {
  searchText: string;
}

/**
 *  Displays list of translations in opened collapse component
 *
 * @returns
 */
export const TranslationContainer = forwardRef<HTMLDivElement, TranslationContainerProps>(
  ({ cz_translation, ua_translation, ua_transcription, cz_transcription, searchText }, ref): JSX.Element => {
    const { currentLanguage, otherLanguage } = useLanguage();

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
      <div ref={ref} className="sm:grid sm:grid-cols-[50%_1px_50%]   sm:items-center  p-2  border-b-slate-200 bg-primary-white">
        {/* CZ translation  */}
        {/* CZ translation  */}
        <Translation
          searchText={searchText}
          language={currentLanguage}
          transcription={languageTranslation[currentLanguage].transcription}
          translation={languageTranslation[currentLanguage].translation}
        />
        {/* Divider */}
        <div className="w-full h-0 sm:h-full sm:py-2 justify-self-center sm:w-0 border-1  border-[#D2D2D2]"></div>
        {/* UA translation  */}
        <Translation
          searchText={searchText}
          language={otherLanguage}
          transcription={languageTranslation[otherLanguage].transcription}
          translation={languageTranslation[otherLanguage].translation}
        />
      </div>
    );
  }
);
