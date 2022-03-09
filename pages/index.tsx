import { useTranslation } from 'next-i18next';
import type { NextPage } from 'next';
import Head from 'next/head';
export { getStaticProps } from '../utils/localization';
import Link from 'next/link';
import Image from 'next/image'
import HeartsUkraine from '../public/hearts-for-ukraine.png'
import DictionaryIcon from '../public/icons/book-font.svg';
import MovappIcon from '../public/icons/movapp-bw-icon.svg';

const Home: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Head>
        <title>{t('seo.homepage_page_title')}</title>
        <meta name="description" content={t('seo.homepage_page_description')} />
        <meta name="twitter:title" content={t('seo.homepage_page_title')} />
      </Head>
      <div className="bg-homepage-hero bg-center pt-20 pb-[10rem] pl-4 pr-4 bg-cover">
        <h1 className="text-center max-w-3xl m-auto pt-12 pb-12 text-primary-blue text-[2.5rem] leading-snug">{t('homepage.title')}</h1>
      </div>
      <div className="max-w-7xl m-auto px-2 sm:px-4">
        <div className="max-w-7xl bg-white p-12 flex flex-wrap md:flex-nowrap shadow-xxl mt-[-6rem]">
          <div className="homepage-box group hover:text-primary-blue md:w-2/6 mb-8 mr-8 pr-8 md:border-r-1 md:border-r-solid md:border-r-primary-grey">
            <DictionaryIcon className="w-6 mb-2 group-hover:fill-primary-red" />
            <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
            <Link href={'/dictionary'}>
              {t('homepage.box_dictionary_title')}
            </Link>
            </h2>
            <p>{t('homepage.box_dictionary_description')}</p>
          </div>
          <div className="homepage-box group hover:text-primary-blue sm:w-4/6 md:w-3/6 mb-8 ">
            <MovappIcon className="w-8 mb-2 fill-primary-blue group-hover:fill-primary-red" />
            <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
            <Link href={'/about'}>
              {t('homepage.box_movapp_title')}
            </Link>
            </h2>
            <p className="mb-2">{t('homepage.box_movapp_description_top')}</p>
            <p>
              <em>{t('homepage.box_movapp_description_bottom')}</em>
            </p>
          </div>
          <div className="sm:w-2/6 md:w-1/6 mb-8 flex justify-end">
            <Image src={HeartsUkraine} alt="Česká a Ukrajinská vlajka v srdcích." className="self-center" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
