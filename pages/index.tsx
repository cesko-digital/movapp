import { useTranslation } from 'next-i18next';
import type { NextPage } from 'next';
import Head from 'next/head';
export { getStaticProps } from 'utils/localization';
import Link from 'next/link';
import Image from 'next/image';
import HeartsUkraine from '../public/hearts-for-ukraine.png';
import DictionaryIcon from '../public/icons/book-font.svg';
import ChildIcon from '../public/icons/child.svg';
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
        <h1 className="text-center max-w-3xl m-auto pt-12 pb-12 text-primary-blue text-3xl sm:text-4xl leading-snug">
          {t('homepage.title')}
        </h1>
      </div>
      <div className="max-w-7xl m-auto px-2 sm:px-4">
        <div className="max-w-7xl bg-white p-4 sm:p-8 md:p-12 shadow-xxl mt-[-6rem]">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="homepage-box w-full group hover:text-primary-blue    pr-4 md:border-r-1 md:border-r-solid md:border-r-primary-grey">
              <DictionaryIcon className="w-6 mb-2 group-hover:fill-primary-red" />
              <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                <Link href={'/dictionary'}>
                  <a>{t('homepage.box_dictionary_title')}</a>
                </Link>
              </h2>
              <p>{t('homepage.box_dictionary_description')}</p>
            </div>
            <div className="homepage-box w-full group hover:text-primary-blue    pr-4 md:border-r-1 md:border-r-solid md:border-r-primary-grey">
              <ChildIcon className="w-6 mb-2 group-hover:fill-primary-red" />
              <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                <Link href={'/kids'}>
                  <a>{t('homepage.box_child_title')}</a>
                </Link>
              </h2>
              <p>{t('homepage.box_child_description')}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-[70%_30%] gap-8 mt-10">
            <div className="homepage-box group hover:text-primary-blue my-6 md:my-0">
              <MovappIcon className="w-8 mb-2 fill-primary-blue group-hover:fill-primary-red" />
              <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                <Link href={'/about'}>
                  <a>{t('homepage.box_movapp_title')}</a>
                </Link>
              </h2>
              <p className="mb-2">{t('homepage.box_movapp_description_top')}</p>
              <p>
                <em>{t('homepage.box_movapp_description_bottom')}</em>
              </p>
            </div>
            <div className="justify-self-center my-4 md:my-0">
              <Image src={HeartsUkraine} alt="Česká a Ukrajinská vlajka v srdcích." width={140} height={164} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
