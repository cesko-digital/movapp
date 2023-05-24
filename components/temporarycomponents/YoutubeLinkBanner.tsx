import { useTranslation } from 'next-i18next';
import YoutubeLinkIcon from 'public/icons/youtube-link.svg';
import Image from 'next/legacy/image';
import { getCountryVariant } from 'utils/locales';
import Lekarna_UK_mobile from 'public/youtubebanner/lekarna-uk--mobile.png';
import Lekarna_CZ_mobile from 'public/youtubebanner/lekarna-cz--mobile.png';
import Lekarna_UK_desktop from 'public/youtubebanner/lekarna-uk--desktop.png';
import Lekarna_CZ_desktop from 'public/youtubebanner/lekarna-cz--desktop.png';
import Person_UK from 'public/youtubebanner/person-uk.png';
import Person_CZ from 'public/youtubebanner/person-cz.png';
import { useLanguage } from '../../utils/useLanguageHook';

const YOUTUBE_VIDEO_CODES_CZ: Array<string> = [
  'yf40iMpWM3c', //1 - Lékárna
  'v0MDWXL281o', //2 - Na masáži
  'gN_rr3CevqQ', //3 - Muchomůrka zelená
  'vx6f8F8mvfs', //4 - Ovoce
  'JEZpbOqFak0', //5 - U doktora
  '4JdK3Hc5gCU', //6 - Na poště
  'mgpjnYsTAnA', //7 - Na nákupu
  'IJ6RH8jGPII', //8 - V zoo
  'BujRB73XbaI', //9 - U krejčího
];

const YOUTUBE_VIDEO_CODES_UK: Array<string> = [
  'pLMWJcbV0eA', //10 - Аптека
  '0lZYqftgdc8', //11 - На масажі
  '9THEohGeCZ4', //12 - Поганка
  'EU6g6VnWSW8', //13 - Фрукти
  'XPOQd_EVrh0', //14 - У лікаря
  'hiLHhYXBo2s', //15 - У кравця
  'S_eRJBkp_Zc', //16 - На пошті
  'AjK635bgEZo', //17 - На шопінг
  'KMz8hsfnC3Q', //18 - У зоопарку
];

const YoutubeLinkBanner = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const isUk = currentLanguage === 'uk';

  const getRandomYotubeVideoCode = () => {
    const videoCodes = isUk ? YOUTUBE_VIDEO_CODES_UK : YOUTUBE_VIDEO_CODES_CZ;
    const randNumber = Math.floor(Math.random() * videoCodes.length);
    return `https://www.youtube.com/watch?v=${videoCodes[randNumber]}&list=PLOX5xelTsEv8H3U2MfUaRNveb35LoIZn6`;
  };

  return (
    <div className="max-w-7xl m-auto px-2 sm:px-4">
      <div className="youtube-banner bg-[#013ABD] h-[770px] pt-20 px-2 flex flex-col overflow-hidden justify-between sm:px-12 sm:relative sm:h-[680px] lg:flex-row lg:pb-6 lg:pt-6 lg:h-[260px]">
        <div className="lg:flex lg:flex-col lg:justify-center">
          <h1 className="m-0 p-0 text-4xl text-white pb-10 lg:pb-4">{t(`homepage.title.${getCountryVariant()}`)}</h1>
          <a href={getRandomYotubeVideoCode()} target={'_blank'} rel="noopener">
            <YoutubeLinkIcon className="cursor-pointer hover:fill-[#BD1E1F]" />
          </a>
        </div>
        <div className="lg:flex-[1_1_80%] lg:relative lg:pt-5">
          <div className="flex justify-center gap-x-4 lg:gap-x-20">
            <div className="block lg:hidden">
              <Image src={Lekarna_UK_mobile} alt="Ikona se slovem aптека" />
            </div>
            <div className="mt-3 block lg:hidden">
              <Image src={Lekarna_CZ_mobile} alt="Ikona se slovem lekárna" />
            </div>
            <div className="hidden lg:block">
              <Image src={Lekarna_UK_desktop} alt="Ikona se slovem aптека" />
            </div>
            <div className="hidden lg:block">
              <Image src={Lekarna_CZ_desktop} alt="Ikona se slovem lekárna" />
            </div>
          </div>
          <a href={getRandomYotubeVideoCode()} target={'_blank'} rel="noopener" className="flex justify-center gap-x-4 -mb-4 lg:block">
            <div className="lg:absolute lg:-bottom-9 lg:left-12 lg:h-[140px] lg:w-[120px] xl:left-1/4">
              <Image src={Person_UK} alt="Obrázek osoby" />
            </div>
            <div className="lg:absolute lg:-bottom-9 lg:right-12 lg:h-[140px] lg:w-[90px] xl:right-1/4">
              <Image src={Person_CZ} alt="Obrázek osoby" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default YoutubeLinkBanner;
