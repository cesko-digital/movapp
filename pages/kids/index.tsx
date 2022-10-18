import { useTranslation } from 'next-i18next';
import React, { useMemo } from 'react';
import { Button } from '../../components/basecomponents/Button';
import { KidsTranslationsContainer } from '../../components/basecomponents/KidsTranslationContainer';
import { TranslationJSON } from 'utils/Phrase_deprecated';
import SEO from 'components/basecomponents/SEO';
import { getCountryVariant } from 'utils/locales';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { DictionaryDataObject, fetchDictionary, getKidsCategory } from '../../utils/getDataUtils';
import { getServerSideTranslations } from '../../utils/localization';
import { Player } from '@remotion/player';
import KidsComp from 'components/basecomponents/KidsCompSeq';
import dynamic from 'next/dynamic';
import { Phrase } from '../../utils/getDataUtils';

export type KidsTranslation = TranslationJSON & { image: string };

interface KidsPlayerProps {
  translations: Phrase[];
}

const _KidsPlayer = ({ translations }: KidsPlayerProps) => (
  <div className="flex items-center flex-col">
    {/* <Button
      className="bg-primary-blue"
      text="play remotion"
      onClick={() => {
        AudioPlayer.getInstance().playSrc(translations[0].getSoundUrl('uk'));
      }}
    /> */}
    <Player
      component={KidsComp}
      inputProps={{ translations }}
      durationInFrames={translations.length * 30 * 3}
      compositionWidth={800}
      compositionHeight={600}
      numberOfSharedAudioTags={translations.length}
      fps={30}
      style={{
        width: 800,
        height: 600,
      }}
      controls
    />
  </div>
);

const KidsPlayer = dynamic(() => Promise.resolve(_KidsPlayer), {
  ssr: false,
});

const KidsSection = ({ dictionary }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  const kidsCategory = useMemo(() => getKidsCategory(dictionary), [dictionary]);

  return (
    <div className="bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] -mb-8 -m-2">
      <SEO
        title={t(`seo.kids_page_title.${getCountryVariant()}`)}
        description={t(`seo.kids_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover-kids.jpg"
      />
      <div className="text-center sm:text-right pt-8 mr-0 sm:mr-16">
        <a href={`/kids/${getCountryVariant()}/omalovanky.pdf`} target="_blank" rel="noopener noreferrer" download>
          <Button text={t('kids_page.downloadPDF')} className="bg-primary-blue" />
        </a>
      </div>

      {kidsCategory && <KidsPlayer translations={kidsCategory?.translations} />}

      <div className="flex flex-wrap justify-center min-h-screen m-auto sm:py-10 px-2 sm:px-4">
        {kidsCategory?.translations.map((phrase) => {
          return <KidsTranslationsContainer key={phrase.getTranslation('uk')} imageUrl={phrase.getImageUrl()} phrase={phrase} />;
        })}
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
