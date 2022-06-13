import { useTranslation } from 'next-i18next';
import React from 'react';
import dynamic from 'next/dynamic';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
export { getStaticProps } from 'utils/localization';

const MemoryGame = dynamic(() => import('components/basecomponents/MemoryGame/MemoryGameThemeLoader'), {
  ssr: false,
});

const MemoryGameSection = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap flex-col items-center min-h-screen m-auto sm:py-10 py-2 px-2 sm:px-4 overflow-hidden">
        <MemoryGame theme="default" />        
      </div>
    </div>
  );
};

export default MemoryGameSection;
