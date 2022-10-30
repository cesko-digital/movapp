import { useTranslation } from 'next-i18next';
import { getCountryVariant } from 'utils/locales';
import YoutubeLinkIcon from 'public/icons/youtube-link.svg';
import Image from 'next/image';
import { ReactNode } from 'react';
import Lekarna_UK_mobile from 'public/youtubebanner/lekarna-uk--mobile.png';
import Lekarna_CZ_mobile from 'public/youtubebanner/lekarna-cz--mobile.png';
import Lekarna_UK_desktop from 'public/youtubebanner/lekarna-uk--desktop.png';
import Lekarna_CZ_desktop from 'public/youtubebanner/lekarna-cz--desktop.png';
import Person_UK from 'public/youtubebanner/person-uk.png';
import Person_CZ from 'public/youtubebanner/person-cz.png';

export const YoutubeLinkBanner = () => {
  const { t } = useTranslation();

  const IMAGES: Record<string, ReactNode> = {
    'lekarna-uk-mobile': <Image src={Lekarna_UK_mobile} alt="Ikona se slovem aптека" />,
    'lekarna-cz-mobile': <Image src={Lekarna_CZ_mobile} alt="Ikona se slovem lekárna" />,
    'lekarna-uk-desktop': <Image src={Lekarna_UK_desktop} alt="Ikona se slovem aптека" />,
    'lekarna-cz-desktop': <Image src={Lekarna_CZ_desktop} alt="Ikona se slovem lekárna" />,
    'person-uk': <Image src={Person_UK} alt="Obrázek osoby" />,
    'person-cz': <Image src={Person_CZ} alt="Obrázek osoby" />,
    'person-uk-desktop': <Image src={Person_UK} alt="Obrázek osoby" width={120} height={140} />,
    'person-cz-desktop': <Image src={Person_CZ} alt="Obrázek osoby" width={90} height={140} />,
  };

  return (
    <div className="max-w-7xl m-auto px-2 sm:px-4">
      <div className="youtube-banner pt-20 px-2 flex flex-col overflow-hidden justify-between sm:px-12 sm:relative lg:flex-row lg:pb-6 lg:pt-6">
        <div className="lg:flex lg:flex-col lg:justify-center">
          <h2 className="m-0 p-0 text-4xl text-white pb-10 lg:text-3xl lg:pb-4">{t(`homepage.title.${getCountryVariant()}`)}</h2>
          <a
            href={'https://www.youtube.com/watch?v=yf40iMpWM3c&list=PLOX5xelTsEv8H3U2MfUaRNveb35LoIZn6&index=1'}
            target={'_blank'}
            rel="noopener"
          >
            <YoutubeLinkIcon className="cursor-pointer hover:fill-[#BD1E1F]" />
          </a>
        </div>
        <div className="lg:flex-[1_1_80%] lg:relative">
          <div className="flex justify-center gap-x-4 lg:gap-x-20">
            <div className="block lg:hidden">{IMAGES['lekarna-uk-mobile']}</div>
            <div className="mt-3 block lg:hidden">{IMAGES['lekarna-cz-mobile']}</div>
            <div className="hidden lg:block">{IMAGES['lekarna-uk-desktop']}</div>
            <div className="hidden lg:block">{IMAGES['lekarna-cz-desktop']}</div>
          </div>
          <div className="flex justify-center gap-x-4 -mb-4 lg:block">
            <div className="block lg:hidden">{IMAGES['person-uk']}</div>
            <div className="block lg:hidden">{IMAGES['person-cz']}</div>
            <div className="hidden lg:block absolute -bottom-9 left-12 xl:left-1/4">{IMAGES['person-uk-desktop']}</div>
            <div className="hidden lg:block absolute -bottom-9 right-12 xl:right-1/4">{IMAGES['person-cz-desktop']}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
