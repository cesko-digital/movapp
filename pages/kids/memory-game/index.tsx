import { useTranslation } from 'next-i18next';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionaryForGame } from 'utils/getDataUtils';
import { getServerSideTranslations } from 'utils/localization';
import MemoryGame from 'components/basecomponents/MemoryGame/MemoryGame';

const MemoryGameSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_memorygame_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_memorygame_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="flex flex-wrap flex-col items-center min-h-screen m-auto sm:py-10 py-2 px-2 sm:px-4 overflow-hidden">
        <MemoryGame dictionary={dictionary} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ dictionary: DictionaryDataObject }> = async ({ locale }) => {
  const dictionary = await fetchDictionaryForGame();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      dictionary,
      ...localeTranslations,
    },
  };
};

export default MemoryGameSection;
