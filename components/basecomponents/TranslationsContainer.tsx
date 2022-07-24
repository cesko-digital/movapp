import { TranslationComponent } from './TranslationComponent';
import { forwardRef } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase } from '../../utils/getDictionaryData';

interface PhraseContainerProps {
  translation: Phrase;
  searchText: string;
}

/**
 *  Displays list of translations in opened collapse component
 *
 * @returns
 */
export const TranslationContainer = forwardRef<HTMLDivElement, PhraseContainerProps>(({ translation, searchText }, ref): JSX.Element => {
  const { currentLanguage, otherLanguage } = useLanguage();

  return (
    <div ref={ref} className="sm:grid sm:grid-cols-[50%_1px_50%]   sm:items-center  p-2  border-b-slate-200 bg-primary-white">
      <TranslationComponent
        searchText={searchText}
        translation={translation.getTranslation(currentLanguage)}
        transcription={translation.getTranscription(currentLanguage)}
        soundUrl={translation.getSoundUrl(currentLanguage)}
      />
      {/* Divider */}
      <div className="w-full h-0 sm:h-full sm:py-2 justify-self-center sm:w-0 border-1  border-[#D2D2D2]"></div>
      <TranslationComponent
        searchText={searchText}
        translation={translation.getTranslation(otherLanguage)}
        transcription={translation.getTranscription(otherLanguage)}
        soundUrl={translation.getSoundUrl(otherLanguage)}
      />
    </div>
  );
});
