import { Language } from 'utils/locales';
import czFlag from '../../public/flags/czech.svg';
import skFlag from '../../public/flags/slovak.svg';
import plFlag from '../../public/flags/polish.svg';
import uaFlag from '../../public/flags/ukrainian.svg';
import { ComponentType, HTMLProps } from 'react';

const COUNTRY_FLAG: Record<Language, ComponentType<HTMLProps<HTMLOrSVGImageElement>>> = {
  uk: uaFlag,
  cs: czFlag,
  sk: skFlag,
  pl: plFlag,
};

interface FlagProps {
  width: number;
  height: number;
  className: string;
  language: Language;
}

export const Flag = ({ width, height, className, language }: FlagProps) => {
  const FlagComponent = COUNTRY_FLAG[language];
  return <FlagComponent width={width} height={height} className={className} />;
};
