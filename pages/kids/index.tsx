/* eslint-disable @typescript-eslint/no-unused-vars */
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
// import KidsComp from 'components/basecomponents/KidsCompSeq';
import { AbsoluteFill, Audio, Sequence } from 'remotion';
import dynamic from 'next/dynamic';
import { Phrase } from '../../utils/getDataUtils';
import { AudioPlayer } from 'utils/AudioPlayer';

export type KidsTranslation = TranslationJSON & { image: string };

interface KidsPlayerProps {
  translations: Phrase[];
}

const SequenceList = ({ translations, duration }: { translations: Phrase[]; duration: number }) => {
  // const getAudioComp = useMemo(()=>{

  // return (src: string) => <Audio src={src} />
  //   },[translations]);

  return (
    <>
      {translations.map((phrase, i) => {
        return (
          <Sequence key={phrase.getTranslation('uk')} from={i * duration} durationInFrames={(i + 1) * duration}>
            <AbsoluteFill
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'white',
              }}
            >
              <KidsTranslationsContainer imageUrl={phrase.getImageUrl()} phrase={phrase} />
              <Audio src={phrase.getSoundUrl('uk')} startFrom={0} endAt={120} />
              {/* {getAudioComp(phrase.getSoundUrl('uk'))} */}
            </AbsoluteFill>
          </Sequence>
        );
      })}
      {/* <Audio src={translations[].getSoundUrl('uk')} /> */}
    </>
  );
};

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
      component={SequenceList}
      inputProps={{ translations, duration: 30 * 5 }}
      durationInFrames={translations.length * 30 * 5}
      compositionWidth={800}
      compositionHeight={600}
      numberOfSharedAudioTags={1}
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

      {kidsCategory && <KidsPlayer translations={kidsCategory?.translations.slice(0, 5)} />}

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
