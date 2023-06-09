import { Platform } from '@types';
import Image from 'next/image';
import { AudioPlayer } from '../../../utils/AudioPlayer';
import { Phrase } from '../../../utils/getDataUtils';
import { useLanguage } from '../../../utils/useLanguageHook';
import { useTranslation } from 'next-i18next';

import { useAtom, useSetAtom } from 'jotai';
import { dictionaryAudioPlayAtom, dictionaryActivePhraseAtom } from 'components/basecomponents/Kiosk/atoms';

type Props = {
  platform: Platform;
  phrase: Phrase;
  imageUrl: string | null;
  id?: string;
};

const KioskDictionaryCardImage = ({ platform, phrase, imageUrl, id }: Props) => {
  const { otherLanguage } = useLanguage();
  const { t } = useTranslation();

  const [isPlaying, setIsPlaying] = useAtom(dictionaryAudioPlayAtom);
  const setActivePhrase = useSetAtom(dictionaryActivePhraseAtom);

  const renderDefaultImage = () => {
    return (
      <button
        className="w-72 h-72 relative bg-white"
        onClick={() => AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(otherLanguage))}
        aria-label={t('utils.play') + ' ' + otherLanguage}
      >
        <Image id={id} src={imageUrl ?? ''} layout="fill" sizes="20vw" objectFit="cover" alt={phrase.getTranslation(otherLanguage)} />
      </button>
    );
  };
  const renderKioskImage = () => {
    return (
      <button
        className="w-[400px] h-[280px] relative bg-transparent"
        onClick={async () => {
          if (isPlaying) return;
          setActivePhrase(phrase.getTranslation(otherLanguage));
          setIsPlaying(true);
          await AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(otherLanguage));
          setIsPlaying(false);
        }}
        aria-label={t('utils.play') + ' ' + otherLanguage}
      >
        <Image id={id} src={imageUrl ?? ''} layout="fill" sizes="20vw" alt={phrase.getTranslation(otherLanguage)} />
      </button>
    );
  };

  switch (platform) {
    case Platform.KIOSK:
      return renderKioskImage();
    case Platform.WEB:
    default:
      return renderDefaultImage();
  }
};

export default KioskDictionaryCardImage;
