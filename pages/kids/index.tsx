import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import { Button } from '../../components/basecomponents/Button';
import { TranslationJSON } from 'utils/Phrase_deprecated';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionary, getKidsCategory } from '../../utils/getDataUtils';
import { getServerSideTranslations } from '../../utils/localization';
import { normalizeForId } from 'utils/textNormalizationUtils';
import { useLanguage } from '../../utils/useLanguageHook';

import KidsDictionaryList from 'components/basecomponents/KidsDictionaryList';
export type KidsTranslation = TranslationJSON & { image: string };

const KidsSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const kidsCategory = useMemo(() => getKidsCategory(dictionary), [dictionary]);
  const { currentLanguage } = useLanguage();
  const isUk = currentLanguage === 'uk';
  const pdfUrl = isUk ? `/pdf/${getCountryVariant()}-omalovanky.pdf` : 'pdf/omalovanky.pdf';

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="text-center sm:text-right pt-8 mr-0 sm:mr-16">
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" download>
          <Button buttonStyle="primary">{t('kids_page.downloadPDF')}</Button>
        </a>
      </div>
      <div className="flex flex-wrap justify-center min-h-screen m-auto sm:py-10 px-2 sm:px-4">
        <KidsDictionaryList kidsCategory={kidsCategory} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{ dictionary: DictionaryDataObject }> = async ({ locale }) => {
  const dictionary = await fetchDictionary();
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      dictionary,
      ...localeTranslations,
    },
  };
};

export default KidsSection;
