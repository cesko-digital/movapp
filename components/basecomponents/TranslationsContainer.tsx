import { TranslationComponent as PhraseComponent } from './TranslationComponent';
import { forwardRef } from 'react';
import { useLanguage } from 'components/utils/useLanguageHook';
import { Phrase } from 'components/utils/Phrase';

interface PhraseContainerProps {
  translation: Phrase;
  searchText: string;
}

/**
 *  Displays list of translations in opened collapse component
 *
 * @returns
 */
export const TranslationContainer = forwardRef<HTMLDivElement, PhraseContainerProps>(
  ({ translation: phrase, searchText }, ref): JSX.Element => {
    const { currentLanguage, otherLanguage } = useLanguage();

    return (
      <div ref={ref} className="sm:grid sm:grid-cols-[50%_1px_50%]   sm:items-center  p-2  border-b-slate-200 bg-primary-white">
        <PhraseComponent
          searchText={searchText}
          language={currentLanguage}
          translation={phrase.getTranslation(currentLanguage)}
          transcription={phrase.getTranscription(currentLanguage)}
        />
        {/* Divider */}
        <div className="w-full h-0 sm:h-full sm:py-2 justify-self-center sm:w-0 border-1  border-[#D2D2D2]"></div>
        <PhraseComponent
          searchText={searchText}
          language={otherLanguage}
          translation={phrase.getTranslation(otherLanguage)}
          transcription={phrase.getTranscription(otherLanguage)}
        />
      </div>
    );
  }
);
