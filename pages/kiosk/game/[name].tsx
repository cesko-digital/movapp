import { useEffect } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import dynamic from 'next/dynamic';
import { ParsedUrlQuery } from 'querystring';
import stories from 'data/stories';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSetAtom } from 'jotai';

/** Components */
const MemoryGame = dynamic(() => import('components/basecomponents/MemoryGame/MemoryGame'), {
  loading: () => <p>Loading...</p>,
});
const KidsDictionary = dynamic(() => import('components/basecomponents/Kiosk/KidsDictionary'), {
  loading: () => <p>Loading...</p>,
});
import StoriesList from 'components/basecomponents/Story/StoriesList';

/** Hooks, HOC, Utils, Types */
import withKioskLayout from 'utils/hoc/withKioskLayout';
import { Story, Platform } from '@types';
import { currentPlatformAtom } from 'components/basecomponents/Kiosk/atoms';
import { getServerSideTranslations } from 'utils/localization';

/** Data */
import { GAMES, Game as GameType } from 'data/kiosk-games';

interface GamePageParams extends ParsedUrlQuery {
  name: string;
}

interface GameProps {
  gameName: string;
  stories: Story[];
}

const Game = ({ gameName, stories }: GameProps) => {
  const setPlatform = useSetAtom(currentPlatformAtom);

  // We are on kiosk, set platform once
  useEffect(() => {
    setPlatform(Platform.KIOSK);
  }, []);

  switch (gameName) {
    case 'pexeso':
      return <MemoryGame />;
    case 'slovicka':
      return <KidsDictionary />;
    case 'stories':
      return <StoriesList stories={stories} />;
    default:
      return <div>Game not implemented yet.</div>;
  }
};

export const getStaticPaths: GetStaticPaths<GamePageParams> = async () => {
  const mainLanguage = process.env.NEXT_PUBLIC_COUNTRY_VARIANT ?? 'cs';
  const LANGUAGES = [mainLanguage, 'uk'];

  // We need to generate the paths for each locale
  const paths = LANGUAGES.flatMap((locale) =>
    GAMES.map((game: GameType) => ({
      params: { name: game.name },
      locale, // Include the locale in the path object
    }))
  );

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const localeTranslations = await getServerSideTranslations(locale);

  const gameName = params?.name ?? '';

  return {
    props: {
      ...localeTranslations,
      gameName,
      stories,
      ...(await serverSideTranslations(locale ?? 'cs', ['common'])),
    },
  };
};

export default withKioskLayout(Game);
