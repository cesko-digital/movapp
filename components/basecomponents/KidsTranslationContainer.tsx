import React from 'react';
import { KidsTranslation } from './KidsTranslation';
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase } from '../../utils/getDataUtils';
import { Platform } from '@types';
import KioskDictionaryCardImage from './KioskDictionaryGame/KioskDictionaryCardImage';
interface KidsTranslationContainerProps {
  phrase: Phrase;
  imageUrl: string | null;
  id?: string;
  searchText?: string;
  renderFor?: Platform;
}

/**
 *  Displays list of translations in opened collapse component
 *
 * @returns
 */
export const KidsTranslationsContainer = ({
  phrase,
  imageUrl,
  id,
  renderFor = Platform.WEB,
}: KidsTranslationContainerProps): JSX.Element => {
  const { currentLanguage, otherLanguage } = useLanguage();

  const currentTranslation = phrase.getTranslation(currentLanguage);
  const otherTranslation = phrase.getTranslation(otherLanguage);

  const cardClasses = `max-w-sm rounded-2xl overflow-hidden shadow-xl m-5 md:m-8 bg-[#f7e06a] ${
    renderFor === Platform.KIOSK ? 'w-[400px]' : 'w-72 max-h-[34rem]'
  }`;
  const buttonsWrapperClasses = `${renderFor === Platform.KIOSK ? 'flex flex-row justify-between' : 'px-6 py-4'}`;

  return (
    <div className={cardClasses}>
      <KioskDictionaryCardImage platform={renderFor} phrase={phrase} imageUrl={imageUrl} id={id} />
      <div className={buttonsWrapperClasses}>
        <KidsTranslation
          language={currentLanguage}
          transcription={phrase.getTranscription(currentLanguage)}
          translation={currentTranslation}
          soundUrl={phrase.getSoundUrl(currentLanguage)}
          renderFor={renderFor}
        />
        <KidsTranslation
          language={otherLanguage}
          transcription={phrase.getTranscription(otherLanguage)}
          translation={otherTranslation}
          soundUrl={phrase.getSoundUrl(otherLanguage)}
          renderFor={renderFor}
        />
      </div>
    </div>
  );
};
