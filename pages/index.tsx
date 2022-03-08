import type { NextPage } from 'next';
import Head from 'next/head';
export { getStaticProps } from '../utils/localization';

const Home: NextPage = () => {
  return (
    <div className="max-w-3xl m-auto">
      <Head>
        <title>Movapp.cz – aby se Češi a Ukrajinci snadno domluvili</title>
        <meta name="description" content="Přehled základních česko-ukrajinských frází a nástroje k jejich procvičování. Rozcestník materiálů k učení. Vytvářeno s láskou." />
      </Head>
    </div>
  );
};

export default Home;
