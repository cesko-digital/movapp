import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { FOOTER_NAVIGATION } from '../../../data/footerNavigation';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-primary-black">
      <div className="max-w-4xl m-auto p-2 sm:py-5 ">
        <p className="text-primary-yellow text-center font-extrabold text-xl sm:text-2xl mt-2 sm:mt-4 mb-2 sm:mb-6">#StandWithUkraine</p>
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {FOOTER_NAVIGATION.map(({ title, link, description }, index) => {
            return (
              <Link key={index} href={link}>
                <a target={'_blank'} className="sm:w-2/6">
                  <div className="py-1">
                    <p className="text-white text-center text-sm sm:text-base font-semibold my-2">{title}</p>
                    <p className="text-white text-center font-extralight text-xs sm:text-sm">{t(description)}</p>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
        <p className="text-white text-center text-xs pt-10">
          Přidej se k vývoji na{' '}
          <Link href={'https://github.com/no-need-to-be-anonymous/ua-jazykova-aplikace'}>
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
