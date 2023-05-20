import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { ReactNode } from 'react';
import { CountryVariant, getCountryVariant } from 'utils/locales';
import CzFlag from '../../public/icons/cz-flag.svg';
import PlFlag from '../../public/icons/pl-flag.svg';
import SkFlag from '../../public/icons/sk-flag.svg';

interface CountryVariantFlag {
  svg: ReactNode;
  link: string;
  country: CountryVariant;
  language: string;
}

const flags: CountryVariantFlag[] = [
  { svg: <CzFlag />, link: 'movapp.cz', country: 'cs', language: 'Česky' },
  { svg: <SkFlag />, link: 'sk.movapp.eu', country: 'sk', language: 'Slovensky' },
  { svg: <PlFlag />, link: 'pl.movapp.eu', country: 'pl', language: 'Polski' },
];

export const LanguagesFlags = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mb-16 mt-6 flex flex-col items-center">
      <h2 className="text-2xl text-center px-2">{t(`homepage.languages`)}</h2>
      <div className="flex flex-col sm:flex-row items-center">
        {flags
          .filter(({ country }) => country !== getCountryVariant())
          .map(({ svg, link, country, language }) => (
            <Link
              href={`https://${link}`}
              passHref={true}
              key={country}
              className="mx-8 mb-6 flex flex-col items-center hover:cursor-pointer hover:scale-110 transition-all"
            >
              {svg}
              <p>{language}</p>
            </Link>
          ))}
      </div>
    </div>
  );
};
