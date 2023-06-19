import React from 'react';
import { useAtomValue } from 'jotai';

/** Components */
import { KidsTranslation } from './KidsTranslation';
import KioskDictionaryCardImage from './KioskDictionaryGame/KioskDictionaryCardImage';

/** Hooks, Types, Utils, etc. */
import { useLanguage } from 'utils/useLanguageHook';
import { Platform, KidsTranslationContainerProps } from '@types';
import { currentPlatformAtom, dictionaryAudioPlayAtom, dictionaryActivePhraseAtom } from './Kiosk/atoms';
import { Language, LanguageEnum } from 'utils/locales';

const ACTIVE_STYLE = {
  [LanguageEnum.CZECH]: 'shadow-czech transform rotate-[-5deg] !bg-kiosk-red',
  [LanguageEnum.UKRAINIAN]: 'shadow-ukraine transform rotate-[5deg] !bg-kiosk-yellow',
};

const KidsTranslationsContainer = ({ phrase, imageUrl, id }: KidsTranslationContainerProps): JSX.Element => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const renderFor = useAtomValue<Platform>(currentPlatformAtom);
  const isPlaying = useAtomValue(dictionaryAudioPlayAtom);
  const activePhrase = useAtomValue(dictionaryActivePhraseAtom);

  const isActiveLanguage = (language: Language) =>
    isPlaying && activePhrase === phrase.getTranslation(language) && renderFor === Platform.KIOSK;

  const isActive = {
    [LanguageEnum.CZECH]: isActiveLanguage(LanguageEnum.CZECH),
    [LanguageEnum.UKRAINIAN]: isActiveLanguage(LanguageEnum.UKRAINIAN),
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
    isActive[LanguageEnum.CZECH] ? ACTIVE_STYLE[LanguageEnum.CZECH] : '',
    isActive[LanguageEnum.UKRAINIAN] ? ACTIVE_STYLE[LanguageEnum.UKRAINIAN] : '',
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
      {(isActive[LanguageEnum.CZECH] || isActive[LanguageEnum.UKRAINIAN]) && (
        <div
          className={`absolute top-0 bottom-0 left-0 right-0 z-10 ${isActive[LanguageEnum.CZECH] ? 'cz' : ''} ${
            isActive[LanguageEnum.UKRAINIAN] ? 'uk' : ''
          }`}
        />
      )}
      <KioskDictionaryCardImage
        phrase={phrase}
        imageUrl={imageUrl}
        id={id}
        isActive={isActive[LanguageEnum.CZECH] || isActive[LanguageEnum.UKRAINIAN]}
      />
      <div className={renderFor === Platform.KIOSK ? 'flex flex-row justify-between' : 'px-6 py-4'}>
        {isActive[LanguageEnum.CZECH] && renderKidsTranslation(currentLanguage, true)}
        {isActive[LanguageEnum.UKRAINIAN] && renderKidsTranslation(otherLanguage, true)}
        {!isActive[LanguageEnum.CZECH] && !isActive[LanguageEnum.UKRAINIAN] && (
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
