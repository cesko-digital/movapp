import React from 'react';
import { KidsTranslation } from './KidsTranslation';
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase } from '../../utils/getDataUtils';
import { Platform } from '@types';
import KioskDictionaryCardImage from './KioskDictionaryGame/KioskDictionaryCardImage';

import { useAtomValue } from 'jotai';
import { dictionaryAudioPlayAtom, dictionaryActivePhraseAtom } from './Kiosk/atoms';
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

  const isPlaying = useAtomValue(dictionaryAudioPlayAtom);
  const activePhrase = useAtomValue(dictionaryActivePhraseAtom);

  const isCzechActive = isPlaying && activePhrase === phrase.getTranslation() && renderFor === Platform.KIOSK;
  const isUkrainianActive = isPlaying && activePhrase === phrase.getTranslation('uk') && renderFor === Platform.KIOSK;
  const cardClasses = `max-w-sm rounded-2xl overflow-hidden shadow-xl m-5 md:m-8 bg-[#f7e06a] ${
    renderFor === Platform.KIOSK ? 'w-[400px]' : 'w-72 max-h-[34rem]'
  } ${isCzechActive ? 'czech-sound !bg-kiosk-red' : ''} ${isUkrainianActive ? 'ukraine-sound !bg-kiosk-yellow' : ''}`;
  const buttonsWrapperClasses = `${renderFor === Platform.KIOSK ? 'flex flex-row justify-between' : 'px-6 py-4'}`;

  return (
    <div className={cardClasses} style={{ position: 'relative' }}>
      {isCzechActive || isUkrainianActive ? (
        <div className={`absolute top-0 bottom-0 left-0 right-0 z-10 ${isCzechActive ? 'cz' : ''} ${isUkrainianActive ? 'uk' : ''}`} />
      ) : null}
      <KioskDictionaryCardImage
        platform={renderFor}
        phrase={phrase}
        imageUrl={imageUrl}
        id={id}
        isActive={isCzechActive || isUkrainianActive}
      />
      <div className={buttonsWrapperClasses}>
        {isCzechActive && (
          <KidsTranslation
            language={currentLanguage}
            transcription={phrase.getTranscription(currentLanguage)}
            translation={currentTranslation}
            soundUrl={phrase.getSoundUrl(currentLanguage)}
            renderFor={renderFor}
            isActive
          />
        )}
        {isUkrainianActive && (
          <KidsTranslation
            language={otherLanguage}
            transcription={phrase.getTranscription(otherLanguage)}
            translation={otherTranslation}
            soundUrl={phrase.getSoundUrl(otherLanguage)}
            renderFor={renderFor}
            isActive
          />
        )}
        {!isCzechActive && !isUkrainianActive && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};
