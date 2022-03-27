import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import Image from 'next/image';
import { FOOTER_NAVIGATION } from 'data/footerNavigation';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary-yellow">
      <div className="max-w-4xl m-auto p-2 sm:py-5 ">
        <p className="text-primary-black text-center font-black text-xl sm:text-2xl mt-2 sm:mt-4 mb-2 sm:mb-6">#StandWithUkraine</p>
        <div className="text-center">
          <a href="https://www.instagram.com/movapp_/" target="_blank" rel="noreferrer" className="mr-2">
            <Image src="/icons/icon-instagram.svg" width="30px" height="30px" alt="Instagram" />
          </a>
          <a href="https://twitter.com/movappcz" target="_blank" rel="noreferrer" className="ml-2">
            <Image src="/icons/icon-twitter.svg" width="30px" height="30px" alt="Instagram" />
          </a>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {FOOTER_NAVIGATION.map(({ title, link, description }, index) => {
            return (
              <Link key={index} href={link}>
                <a target={'_blank'} className="sm:w-2/6">
                  <div className="py-1">
                    <p className="text-primary-black text-center text-sm sm:text-base font-bold my-2">{title}</p>
                    <p className="text-primary-black text-center font-light text-xs sm:text-sm">{t(description)}</p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
        <p className="text-primary-black text-center text-xs pt-10">
          Přidej se k vývoji na{' '}
          <Link href={'https://github.com/cesko-digital/movapp'}>
            <a target={'_blank'} className="underline">
              Github
            </a>
          </Link>{' '}
          | Obsah tohoto webu je přístupný pod licencí{' '}
          <Link href={'https://creativecommons.org/licenses/by-nc/4.0/'}>
            <a target={'_blank'} className="underline" title="Creative Commons - Uveďte původ-Neužívejte komerčně 4.0">
              CC BY-NC 4.0 Mezinárodní
            </a>
          </Link>
        </p>
      </div>
    </footer>
  );
};
