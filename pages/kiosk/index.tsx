import { NextPage, GetStaticProps } from 'next';
import Image from 'next/image';
import { getServerSideTranslations } from 'utils/localization';
import { useTranslation } from 'next-i18next';

/** Components */
import GameTile from '../../components/basecomponents/Kiosk/GameTile';

const KioskHome: NextPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center w-full">
      <Image src="/images/movapp-logo-kiosk.svg" width={186} height={55} alt="Movapp logo" className="mb-14" />
      <div className="grid grid-cols-2 gap-6">
        <GameTile name="Slovíčka" image="slovicka.png" title={t('header.forkids_words')} />
        <GameTile name="Pexeso" image="pexeso.png" title={t('header.forkids_memorygame')} />
        <GameTile name="Stories" image="pohadky.png" title={t('header.forkids_stories')} />
        <GameTile name="Quiz" image="kviz.png" title={t('header.forkids_imagequiz')} />
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const localeTranslations = await getServerSideTranslations(locale);

  return {
    props: {
      ...localeTranslations,
    },
  };
};

export default KioskHome;
