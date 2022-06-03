import { useTranslation } from 'next-i18next';
import type { NextPage } from 'next';
export { getStaticProps } from 'utils/localization';
import Link from 'next/link';
import Image from 'next/image';
import HeartsUkraine_CZ from '../public/icons/hearts/hearts-for-ukraine_CZ-UA.png';
import HeartsUkraine_SK from '../public/icons/hearts/hearts-for-ukraine_SK-UA.png';
import HeartsUkraine_PL from '../public/icons/hearts/hearts-for-ukraine_PL-UA.png';
import DictionaryIcon from '../public/icons/book.svg';
import WikiIcon from '../public/icons/books.svg';
import ChildIcon from '../public/icons/child.svg';
import ChildSectionImg from '../public/icons/maricka-gorbatenko-2022.jpg';
import MemoryGameIcon from '../public/icons/block-question-light.svg';
import ChildStoriesIcon from '../public/icons/gingerbread-man-light.svg';
import ChildDictionaryIcon from '../public/icons/frog-light.svg';
import AlphabetIcon from '../public/icons/book-font.svg';
import MovappIcon from '../public/icons/movapp-bw-icon.svg';
import KidsSunIcon from '../public/icons/sun.svg';
import EnFlag from '../public/icons/en-flag.svg';
import PlFlag from '../public/icons/pl-flag.svg';
import SkFlag from '../public/icons/sk-flag.svg';
import SEO from 'components/basecomponents/SEO';
import { DownloadAppStore } from '../components/basecomponents/DownloadAppStore';
import { CountryVariant, getCountryVariant } from '../utils/locales';
import { ReactNode } from 'react';
import { DownloadGooglePlay } from '../components/basecomponents/DownloadGooglePlay';

const HEARTS_IMAGE: Record<CountryVariant, ReactNode> = {
  cs: <Image src={HeartsUkraine_CZ} alt="Česká a Ukrajinská vlajka v srdcích." width={140} height={164} />,
  sk: <Image src={HeartsUkraine_SK} alt="Slovenská a Ukrajinská vlajka v srdciach." width={140} height={164} />,
  pl: <Image src={HeartsUkraine_PL} alt="Polskie i Ukraińskie flagi w sercach" width={140} height={164} />,
};

interface Languages {
  country: string;
  svg: ReactNode;
}

const LanguagesFlags: Languages[] = [{country: "eu", svg: <EnFlag/>}, {country: "sk", svg: <SkFlag/>}, {country: "pl", svg: <PlFlag/>}]

const Home: NextPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <SEO
        title={t(`seo.homepage_page_title.${getCountryVariant()}`)}
        description={t(`seo.homepage_page_description.${getCountryVariant()}`)}
        image="https://www.movapp.cz/icons/movapp-cover.jpg"
      />
      <div className="bg-homepage-hero bg-center pt-20 pb-[10rem] pl-4 pr-4 bg-cover">
        <h1 className="text-center max-w-3xl m-auto pt-12 pb-12 text-primary-blue text-3xl sm:text-4xl leading-snug">
          {t(`homepage.title.${getCountryVariant()}`)}
        </h1>
      </div>
      <div className="max-w-7xl m-auto px-2 sm:px-4">
        {/* Child section */}
        <div className="child-section max-w-7xl bg-gradient-to-r from-[#fdf6d2] to-[#99bde4] p-4 sm:p-8 md:p-12 shadow-xxl mt-[-6rem] mb-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="grid md:col-start-1 md:col-end-2 md:grid-cols-1 gap-8">
              <h2 className="md:mt-0 text-primary-blue">{t(`homepage.box_child_section_title`)}</h2>
              <div className="sm:grid grid-cols-2 md:grid-cols-1 gap-8">
                <div className="homepage-box w-full group hover:text-primary-blue    pr-4">
                  <ChildStoriesIcon className="w-6 mb-2 group-hover:fill-primary-red" />
                  <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                    <Link href={'/kids/stories'}>
                      <a>{t('homepage.box_child_stories_title')}</a>
                    </Link>
                  </h2>
                  <p>{t(`homepage.box_child_stories_description.${getCountryVariant()}`)}</p>
                </div>
                <div className="homepage-box w-full group hover:text-primary-blue    pr-4">
                  <MemoryGameIcon className="w-6 mb-2 group-hover:fill-primary-red" />
                  <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                    <Link href={'/kids/memory-game'}>
                      <a>{t('homepage.box_child_memory_title')}</a>
                    </Link>
                  </h2>
                  <p>{t(`homepage.box_child_memory_description`)}</p>
                </div>
                <div className="homepage-box w-full group hover:text-primary-blue    pr-4">
                  <ChildIcon className="w-6 mb-2 group-hover:fill-primary-red" />
                  <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                    <Link href={'/kids#rytir'}>
                      <a>{t('homepage.box_child_words_title')}</a>
                    </Link>
                  </h2>
                  <p>{t(`homepage.box_child_words_description.${getCountryVariant()}`)}</p>
                </div>
                <div className="homepage-box w-full group hover:text-primary-blue    pr-4">
                  <ChildDictionaryIcon className="w-6 mb-2 group-hover:fill-primary-red" />
                  <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                    <Link href={t('homepage.box_child_dictionary_link')}>
                      <a>{t('homepage.box_child_dictionary_title')}</a>
                    </Link>
                  </h2>
                  <p>{t(`homepage.box_child_dictionary_description`)}</p>
                </div>
              </div>
            </div>
            <div className="child-section__image md:col-start-2 md:col-end-4 md:row-start-1 md:row-end-2">
              <Image src={ChildSectionImg} alt={t(`homepage.box_section_image_author`)} />
              {t(`homepage.box_child_section_image_author`)}
            </div>
          </div>
        </div>
        {/* Standard section */}
        <div className="max-w-7xl bg-white p-4 sm:p-8 md:p-12 shadow-xxl mb-8">
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
            <div className="w-full pr-4 md:border-r-1 md:border-r-solid md:border-r-primary-grey">
              <ChildIcon className="w-6 mb-2 group-hover:fill-primary-red" />
              <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                <p>{t('homepage.box_child_title')}</p>
              </h2>
              <div className="mb-2 flex">
                <KidsSunIcon className="mr-2 w-6" />
                <Link href={'/kids'}>
                  <a className="hover:text-primary-blue w-4/5">{t(`homepage.box_child_description.${getCountryVariant()}`)}</a>
                </Link>
              </div>
              {getCountryVariant() === 'cs' ? (
                <div className="flex">
                  <KidsSunIcon className="mr-2 w-6" />
                  <Link href={'/kids/stories'}>
                    <a className="hover:text-primary-blue w-4/5">{t(`homepage.box_child_stories`)}</a>
                  </Link>
                </div>
              ) : null}
              <div className="mb-2 flex">
                <KidsSunIcon className="mr-2 w-6" />
                <Link href={'/kids/memory-game'}>
                  <a className="hover:text-primary-blue w-4/5">{t(`homepage.box_child_memorygame.${getCountryVariant()}`)}</a>
                </Link>
              </div>
            </div>
            <div className="homepage-box w-full group hover:text-primary-blue    pr-4">
              <AlphabetIcon className="w-6 mb-2 group-hover:fill-primary-red" />
              <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                <Link href={'/alphabet'}>
                  <a>{t(`homepage.box_alphabet_title.${getCountryVariant()}`)}</a>
                </Link>
              </h2>
              <p>{t(`homepage.box_alphabet_description.${getCountryVariant()}`)}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {getCountryVariant() === 'cs' && (
              <div className="homepage-box w-full group hover:text-primary-blue    pr-4 md:border-r-1 md:border-r-solid md:border-r-primary-grey">
                <WikiIcon className="w-8 mb-2 fill-primary-blue group-hover:fill-primary-red" />
                <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                  <Link href={'/wiki'}>
                    <a>{t('homepage.box_wiki_title')}</a>
                  </Link>
                </h2>
                <p className="mb-2">{t('homepage.box_wiki_description')}</p>
              </div>
            )}
            <div className="homepage-box group hover:text-primary-blue my-6 md:my-0">
              <MovappIcon className="w-8 mb-2 fill-primary-blue group-hover:fill-primary-red" />
              <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
                <Link href={'/about'}>
                  <a>{t('homepage.box_movapp_title')}</a>
                </Link>
              </h2>
              <p className="mb-2">{t(`homepage.box_movapp_description_top.${getCountryVariant()}`)}</p>
              <p>
                <em>{t(`homepage.box_movapp_description_bottom.${getCountryVariant()}`)}</em>
              </p>
            </div>
            <div className="justify-self-center my-4 md:my-0">{HEARTS_IMAGE[getCountryVariant()]}</div>
          </div>
          {/* Apps section */}
          <div className="grid md:grid-cols-3 gap-4 md:gap-8 mt-28 items-center">
            <p className="text-xl text-center md:text-left">Stáhnout do mobilu</p>
            <div className='flex flex-col md:flex-row items-center'>
              <div className='mx-auto md:mx-0 hover:scale-110 transition-all'><DownloadAppStore /></div>
              <div className='mx-auto md:mx-0 hover:scale-110 transition-all'><DownloadGooglePlay /></div>
            </div>
          </div>          
        </div>
      </div>
      {/* Languages section */}
      <div className="mx-auto my-12 flex flex-col items-center">
        <h2 className='mb-6'>Movapp mluví dalšími jazyky</h2>
        <div className='flex flex-col sm:flex-row items-center'>
        {LanguagesFlags.map((language, i) => (
          <Link href={`https://www.movapp.${language.country}`} passHref={true} key={i}>
            <a className='mx-8 mb-6 flex flex-col items-center hover:cursor-pointer hover:scale-110 transition-all' >
              {language.svg}
              <p>movapp.{language.country}</p>
            </a>
          </Link>
          )
        )}
        </div>
      </div>
    </>
  );
};

export default Home;
