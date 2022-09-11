import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import clsx from 'clsx';
import Link from 'next/link';
import { getCountryVariant } from 'utils/locales';
import { SubmenuItem } from 'data/headerNavigation';
import { OpenDropdown } from '..';

interface DropdownItems extends SubmenuItem {
  active?: boolean;
}

interface DropdownProps {
  submenu: SubmenuItem[];
  dropdown: OpenDropdown;
  id: string;
  callback: (val: boolean) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ submenu, dropdown, id, callback }) => {
  const { t } = useTranslation('common');
  const { asPath } = useRouter();
  const visible = dropdown.id === id;

  const items: DropdownItems[] = submenu
    .filter((item) => item.countryVariant.includes(getCountryVariant()))
    .map((item) => {
      const { link } = item;

      if (link === asPath) {
        return {
          ...item,
          active: true,
        };
      }

      return { ...item };
    });

  return (
    <div className="md:absolute md:top-12">
      <ul className={clsx({ [styles.basic]: true, hidden: !visible || !dropdown.open })}>
        {items.map(({ name, link, active }, index) => {
          return (
            <li
              key={index}
              id={id}
              className={clsx({
                'text-primary-yellow md:text-gray-700 md:list-disc': active,
                'hover:text-primary-blue my-2 md:my-1 text-sm': true,
              })}
              onClick={() => callback(false)}
            >
              <Link href={link}>{t(name)}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const styles = {
  basic: ' bg-blue-600 text-white w-44 flex flex-col mt-3 py-2 rounded-lg text-center md:text-left md:text-gray-700 md:pl-6 md:bg-white md:mt-0',
};
