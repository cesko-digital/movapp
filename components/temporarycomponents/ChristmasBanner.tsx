import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { getCountryVariant } from 'utils/locales';
import { ChristmasBannerItem, ChristmasBannerItemProps } from './ChristmasBannerItem';
import Christmas_Tree from 'public/christmas/christmas-tree.png';
import { useLanguage } from '../../utils/useLanguageHook';

const ChristmasBanner = () => {
    const { t } = useTranslation();
    const { currentLanguage } = useLanguage();
    const isUk = currentLanguage === 'uk';

    const CHRISTMAS_ITEMS: ChristmasBannerItemProps[] = [
      {
        header: t(`christmas_banner.${currentLanguage}.christmas_dictionary_title`), 
        description: t(`christmas_banner.${currentLanguage}.christmas_dictionary_description`),
        link: t(`christmas_banner.${currentLanguage}.christmas_dictionary_link`), 
      },
      {
        header: t(`christmas_banner.${currentLanguage}.witer_dictionary_title`), 
        description: t(`christmas_banner.${currentLanguage}.winter_dictionary_description`),
        link: isUk ? t(`christmas_banner.${currentLanguage}.witer_dictionary_link.${getCountryVariant()}`) : t(`christmas_banner.${currentLanguage}.witer_dictionary_link`)
      },
      {
        header: t(`christmas_banner.${currentLanguage}.christmas_images_title`), 
        description: t(`christmas_banner.${currentLanguage}.christmas_images_description`),
        link: isUk ? t(`christmas_banner.${currentLanguage}.christmas_images_link.${getCountryVariant()}`) : t(`christmas_banner.${currentLanguage}.christmas_images_link`)
      },
      {
        header: t(`christmas_banner.${currentLanguage}.christmas_pexeso_title`), 
        description: t(`christmas_banner.${currentLanguage}.christmas_pexeso_description`),
        link: t(`christmas_banner.${currentLanguage}.christmas_pexeso_link`), 
      },
      // {
      //   header: t(`christmas_banner.${currentLanguage}.christmas_tale_title`), 
      //   description: t(`christmas_banner.${currentLanguage}.christmas_tale_description`),
      //   link: t(`christmas_banner.${currentLanguage}.christmas_tale_link`), 
      // },
    ]

    const OUR_TEAM_LINK = t(`christmas_banner.${getCountryVariant()}.team_link`);

    return (
      <div className="max-w-7xl px-2 sm:px-4 m-auto">
        <div className="bg-[#013ABD] overflow-hidden max-w-7xl pb-[28px]">
          <div className="bg-[url('../public/christmas/christmas-top.png')] h-[102px] bg-center"></div>
          <div className="mx-auto w-[80%]">
            {
              CHRISTMAS_ITEMS.map((item, index) => (
                <ChristmasBannerItem key={index} header={item.header} description={item.description} link={item.link}/>
              ))
            }
            <div className="mt-[28px] mb-[33px] flex justify-center">
              <Image src={Christmas_Tree} alt="Vánoční stromek" />
            </div>
            <div className="text-[16px] leading-[19px] sm:text-[14px] sm:leading-[16px] text-center">
              <a href={OUR_TEAM_LINK} className="text-[#FAD741]">
                {t(`christmas_banner.${getCountryVariant()}.team`)}
              </a>
              <span className="text-white ml-1">{t(`christmas_banner.${getCountryVariant()}.wishing`)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ChristmasBanner;
  