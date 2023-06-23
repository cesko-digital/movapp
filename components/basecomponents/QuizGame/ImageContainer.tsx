import { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from 'utils/useLanguageHook';
import styles from './imageStyle.module.css';

import { Phrase } from 'utils/getDataUtils';

interface ImageContainerProps {
  phrase: Phrase;
  onClick: (phrase: Phrase, correct: boolean) => Promise<void>;
  correct: boolean;
  disabled: boolean;
}

const ImageContainer = ({ phrase, onClick, correct, disabled }: ImageContainerProps): JSX.Element => {
  const { otherLanguage } = useLanguage();
  const [className, setClassName] = useState('');

  return (
    <div
      className={`aspect-square w-full rounded-2xl overflow-hidden shadow-xl bg-white ${className}`}
      onClick={
        disabled
          ? undefined
          : () => {
              setClassName(correct ? styles.match : styles.dontMatch);
              onClick(phrase, correct);
            }
      }
      onAnimationEnd={() => setClassName('')}
    >
      <button className={'w-full h-full relative'}>
        <Image src={phrase.getImageUrl() ?? ''} layout="fill" sizes="33vw" objectFit="cover" alt={phrase.getTranslation(otherLanguage)} />
      </button>
    </div>
  );
};

export default ImageContainer;
