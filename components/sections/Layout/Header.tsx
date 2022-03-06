import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { HEADER_NAVIGATION } from '../../../data/headerNavigation';
import { LOCALES } from '../../../data/locales';

export const Header = () => {
  const { t } = useTranslation('common');
  const router = useRouter();

  return (
    <div className=" bg-primary-blue w-full h-14">
      <div className="max-w-4xl m-auto flex h-full justify-between items-center ">
        {/* Will be reaplaced by logo */}
        <p className="text-white mx-2 w-full">UACZ language app</p>
        <nav className="w-full">
          <ul className="flex justify-end items-center pr-10">
            {HEADER_NAVIGATION.map(({ name, link }, index) => {
              const activePage = router.asPath.includes(link);
              return (
                <Link key={index} href={link}>
                  <a>
                    <li className={`${activePage && 'border-b-2 border-b-primary-yellow'} hover:text-primary-yellow text-white mx-2 `}>
                      {t(name)}
                    </li>
                  </a>
                </Link>
              );
            })}
          </ul>
        </nav>
        {LOCALES.map(({ name }, index) => {
          return (
            <Link key={index} href={router.asPath} locale={name}>
              <a>
                <span className={`text-white cursor-pointer mx-2 `} key={index}>
                  {name}
                </span>
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
