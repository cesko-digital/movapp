import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import ColouredEggs from '../../public/icons/coloured-eggs.png';
import EggsIcon from '../../public/icons/eggs-icon.svg';
import DictionaryIcon from '../../public/icons/book.svg';
import { getCountryVariant } from 'utils/locales';
import Link from 'next/link';

const EasterBanner = () => {
  const { t } = useTranslation();
  const link = t(`easter_banner.box_easter_kids_anchor.${getCountryVariant()}`);

  return (
    <div className="max-w-7xl bg-lime-500 p-4 sm:p-8 md:p-12 shadow-xxl mt-[-6rem] mb-32">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="justify-self-center my-4 md:my-0">
          <Link href={`/dictionary#${t('easter_banner.box_easter_dictionary_anchor')}`}>
            <a>
              <Image src={ColouredEggs} alt="Velikonoční vajíčka." width={256} height={194} />
            </a>
          </Link>
        </div>
        <div className="homepage-box w-full group hover:text-primary-blue    pr-4 md:border-r-1 md:border-r-solid md:border-lime-400">
          <DictionaryIcon className="w-6 mb-2 group-hover:fill-primary-red" />
          <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
            <Link href={`/dictionary#${t('easter_banner.box_easter_dictionary_anchor')}`}>
              <a>{t('easter_banner.box_easter_dictionary_title')}</a>
            </Link>
          </h2>
          <p>{t('easter_banner.box_easter_dictionary_description')}</p>
        </div>
        <div className="homepage-box w-full group hover:text-primary-blue    pr-4">
          <EggsIcon className="w-6 mb-2 group-hover:fill-primary-red" />
          <h2 className="text-lg mt-0 pb-1 inline-block border-b-1 border-b-solid border-b-primary-black">
            <Link href={`/kids#${link}`}>
              <a>{t('easter_banner.box_easter_kids_title')}</a>
            </Link>
          </h2>
          <p>{t('easter_banner.box_easter_kids_description')}</p>
        </div>
      </div>
    </div>
  );
};

export default EasterBanner;
