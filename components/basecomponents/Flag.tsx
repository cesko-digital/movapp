import { Language } from 'data/locales';
import czFlag from '../../public/flags/cz.svg';
import skFlag from '../../public/flags/sk.svg';
import plFlag from '../../public/flags/pl.svg';
import uaFlag from '../../public/flags/ua.svg';
import { ComponentType, HTMLProps } from 'react';

const countryFlagMap: Record<Language, ComponentType<HTMLProps<HTMLOrSVGImageElement>>> = {
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
  const FlagComponent = countryFlagMap[language];
  return <FlagComponent width={width} height={height} className={className} />;
};
