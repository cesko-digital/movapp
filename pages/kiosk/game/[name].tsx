import { GetStaticProps, GetStaticPaths } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
const MemoryGame = dynamic(() => import('components/basecomponents/MemoryGame/MemoryGame'), {
  loading: () => <p>Loading...</p>,
});
const KidsDictionary = dynamic(() => import('components/basecomponents/Kiosk/KidsDictionary'), {
  loading: () => <p>Loading...</p>,
});

import Image from 'next/image';
import { getServerSideTranslations } from 'utils/localization';
import { GAMES, Game as GameType } from 'data/kiosk-games';
import { useInactivityTimeout } from 'utils/useInactivityModal';
import InactivityModal from 'components/basecomponents/Kiosk/InactivityModal';
import { Platform } from '@types';
interface GamePageParams extends ParsedUrlQuery {
  name: string;
}

interface GameProps {
  gameName: string;
}

const Game = ({ gameName }: GameProps) => {
  const router = useRouter();

  const COUNTDOWN_TIME = 30 * 1000; // How long should the countdown be
  const INACTIVITY_TIME = 5 * 60 * 1000; // How long should the user be inactive before the countdown starts
  const { showModal, stayOnPage } = useInactivityTimeout(INACTIVITY_TIME, COUNTDOWN_TIME, '/kiosk');

  let gameComponent;
  switch (gameName) {
    case 'pexeso':
      gameComponent = <MemoryGame />;
      break;
    case 'slovicka':
      gameComponent = <KidsDictionary platform={Platform.KIOSK} />;
      break;
    default:
      gameComponent = <div>Game not implemented yet.</div>;
  }

  return (
    <div className="flex flex-row content-start items-start px-[64px]">
      <button
        className="bg-white rounded-[32px] px-[30px] box-shadow h-[120px] w-[120px] drop-shadow-lg"
        type="button"
        onClick={() => router.back()}
      >
        <Image src="/images/kiosk/arrow-back.svg" width={60} height={120} alt="Back" />
      </button>
      <div className="movapp-kiosk-scrollbar grow h-screen overflow-scroll">
        <div className="flex justify-center mb-10">{gameComponent}</div>
      </div>
      <InactivityModal show={showModal} stayOnPage={stayOnPage} countdownTime={COUNTDOWN_TIME} />
      <Image src="/images/movapp-logo-kiosk.svg" width={187} height={55} alt="Movapp logo" className="ml-6" />
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<GamePageParams> = async () => {
  const LANGUAGES = ['cs', 'uk']; // We support only these languages on kiosk
  const paths = LANGUAGES.flatMap((locale) =>
    GAMES.map((game: GameType) => ({
      params: { name: game.name },
      locale, // Include the locale in the path object
    }))
  );

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<GameProps, GamePageParams> = async ({ params, locale }) => {
  const localeTranslations = await getServerSideTranslations(locale);

  const gameName = params?.name ?? '';

  return {
    props: {
      ...localeTranslations,
      gameName,
    },
  };
};

export default Game;
