import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { FOOTER_NAVIGATION } from '../../../../data/footerNavigation';

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="hidden sm:block bg-primary-black">
      <div className="max-w-4xl m-auto py-5">
        <p className="text-primary-yellow text-center font-extrabold text-2xl mt-4 mb-6">#StandWithUkraine</p>
        <div className="flex justify-between items-center">
          {FOOTER_NAVIGATION.map(({ title, link, description }, index) => {
            return (
              <Link key={index} href={link}>
                <a target={'_blank'}>
                  <div>
                    <p className="text-white text-center font-semibold my-2">{title}</p>
                    <p className="text-white text-center font-extralight text-sm">{t(description)}</p>
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
          | Obsah tohoto webu je přístupný pod licencí Creative Commons CC BY-NC 4.0
        </p>
      </div>
    </footer>
  );
};
