import { Platform } from '@types';
import Image from 'next/image';
import { AudioPlayer } from '../../../utils/AudioPlayer';
import { Phrase } from '../../../utils/getDataUtils';
import { useLanguage } from '../../../utils/useLanguageHook';
import { useTranslation } from 'next-i18next';

const renderDefaultImage = (phrase, imageUrl, id, current, other, t) => {
  return (
    <button
      className="w-72 h-72 relative bg-white"
      onClick={() => AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(other))}
      aria-label={t('utils.play') + ' ' + other}
    >
      <Image id={id} src={imageUrl ?? ''} layout="fill" sizes="20vw" objectFit="cover" alt={phrase.getTranslation(other)} />
    </button>
  );
};
const renderKioskImage = (phrase, imageUrl, id, current, other, t) => {
  return (
    <button
      className="w-[400px] h-[280px] relative bg-white"
      onClick={() => AudioPlayer.getInstance().playSrc(phrase.getSoundUrl(other))}
      aria-label={t('utils.play') + ' ' + other}
    >
      <Image id={id} src={imageUrl ?? ''} layout="fill" sizes="20vw" alt={phrase.getTranslation(other)} />
    </button>
  );
};

type Props = {
  platform: Platform;
  phrase: Phrase;
  imageUrl: string | null;
  id?: string;
};

const KioskDictionaryCardImage = ({ platform, phrase, imageUrl, id }: Props) => {
  const { currentLanguage, otherLanguage } = useLanguage();
  const current = phrase.getTranslation(currentLanguage);
  const other = phrase.getTranslation(otherLanguage);

  const { t } = useTranslation();

  switch (platform) {
    case Platform.KIOSK:
      return renderKioskImage(phrase, imageUrl, id, current, other, t);
    case Platform.WEB:
    default:
      return renderDefaultImage(phrase, imageUrl, id, current, other, t);
  }
};

export default KioskDictionaryCardImage;
