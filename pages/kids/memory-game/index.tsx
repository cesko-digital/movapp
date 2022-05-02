import { useTranslation } from 'next-i18next';
import React from 'react';
import kidsWords from 'data/translations/pro-deti.json';
import dynamic from 'next/dynamic';
import SEO from 'components/basecomponents/SEO';
import MemoryGameLoading from 'components/basecomponents/MemoryGame/MemoryGameLoading';
export { getStaticProps } from 'utils/localization';

const MemoryGame = dynamic(() => import('components/basecomponents/MemoryGame/MemoryGame'), {
  ssr: false,
  loading: () => <MemoryGameLoading />,
});

const normalizeData = ({ main, uk, image }: { main: string; uk: string; image: string }) => ({
  translation: {
    uk,
    main,
  },
  image,
});

const cardsData = kidsWords.map(normalizeData);

const MemoryGameSection = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t('seo.kids_page_title')}
        description={t('seo.kids_page_description')}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap justify-center min-h-screen m-auto sm:py-10 px-2 sm:px-4 overflow-hidden">
        <MemoryGame cardsData={cardsData} />
      </div>
    </div>
  );
};

export default MemoryGameSection;
