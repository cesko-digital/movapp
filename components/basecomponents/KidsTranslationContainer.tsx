import React from 'react';
import { useAtomValue } from 'jotai';

/** Components */
import { KidsTranslation } from './KidsTranslation';
import KioskDictionaryCardImage from './KioskDictionaryGame/KioskDictionaryCardImage';

/** Hooks, Types, Utils, etc. */
import { useLanguage } from 'utils/useLanguageHook';
import { Phrase } from 'utils/getDataUtils';
import { Platform } from '@types';
import { currentPlatformAtom, dictionaryAudioPlayAtom, dictionaryActivePhraseAtom } from './Kiosk/atoms';
import { Language } from 'utils/locales';

export type KidsTranslationContainerProps = {
  phrase: Phrase;
  imageUrl: string | null;
  id?: string;
  searchText?: string;
};

const KidsTranslationsContainer = ({ phrase, imageUrl, id }: KidsTranslationContainerProps): JSX.Element => {
  const { currentLanguage, otherLanguage } = useLanguage();

  const renderFor = useAtomValue<Platform>(currentPlatformAtom);
  const isPlaying = useAtomValue(dictionaryAudioPlayAtom);
  const activePhrase = useAtomValue(dictionaryActivePhraseAtom);

  const ACTIVE_STYLE = {
    [currentLanguage]: 'shadow-czech transform rotate-[-5deg] !bg-kiosk-red',
    [otherLanguage]: 'shadow-ukraine transform rotate-[5deg] !bg-kiosk-yellow',
  };

  const isActiveLanguage = (language: Language) =>
    isPlaying && activePhrase === phrase.getTranslation(language) && renderFor === Platform.KIOSK;

  const isActive = {
    [currentLanguage]: isActiveLanguage(currentLanguage),
    [otherLanguage]: isActiveLanguage(otherLanguage),
  };

  const cardClasses = [
    'max-w-sm',
    'rounded-2xl',
    'overflow-hidden',
    'shadow-xl',
    'm-5',
    'md:m-8',
    'bg-[#f7e06a]',
    renderFor === Platform.KIOSK ? 'w-[400px]' : 'w-72 max-h-[34rem]',
    isActive[currentLanguage] ? ACTIVE_STYLE[currentLanguage] : '',
    isActive[otherLanguage] ? ACTIVE_STYLE[otherLanguage] : '',
  ].join(' ');

  const renderKidsTranslation = (language: Language, isActive: boolean) => (
    <KidsTranslation
      language={language}
      transcription={phrase.getTranscription(language)}
      translation={phrase.getTranslation(language)}
      soundUrl={phrase.getSoundUrl(language)}
      isActive={isActive}
    />
  );

  return (
    <div className={cardClasses} style={{ position: 'relative' }}>
      {(isActive[currentLanguage] || isActive[otherLanguage]) && (
        <div
          className={`absolute top-0 bottom-0 left-0 right-0 z-10 ${isActive[currentLanguage] ? currentLanguage : ''} ${
            isActive[otherLanguage] ? otherLanguage : ''
          }`}
        />
      )}
      <KioskDictionaryCardImage
        phrase={phrase}
        imageUrl={imageUrl}
        id={id}
        isActive={isActive[currentLanguage] || isActive[otherLanguage]}
      />
      <div className={renderFor === Platform.KIOSK ? 'flex flex-row justify-between' : 'px-6 py-4'}>
        {isActive[currentLanguage] && renderKidsTranslation(currentLanguage, true)}
        {isActive[otherLanguage] && renderKidsTranslation(otherLanguage, true)}
        {!isActive[currentLanguage] && !isActive[otherLanguage] && (
          <>
            {/* Not playing any sound, show both buttons */}
            {renderKidsTranslation(currentLanguage, false)}
            {renderKidsTranslation(otherLanguage, false)}
          </>
        )}
      </div>
    </div>
  );
};

export default KidsTranslationsContainer;
