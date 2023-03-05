import { CountryVariant } from 'utils/locales';

type Link = {
  title: string;
  description: string;
  link: string;
};

type FooterLinks = {
  cs?: Link[];
  sk?: Link[];
  pl?: Link[];
  uk: Link[];
};

export const FOOTER_NAVIGATION: Record<CountryVariant, FooterLinks> = {
  cs: {
    cs: [
      {
        title: 'Pomáhej Ukrajině',
        description: 'Portál pro zprostředkování nabídek pomoci',
        link: 'https://www.pomahejukrajine.cz',
      },
      {
        title: 'Stojíme za Ukrajinou',
        description: 'Nezávislý informační rozcestník',
        link: 'https://www.stojimezaukrajinou.cz',
      },
      {
        title: 'Česko.Digital',
        description: 'Skrz jedničky a nuly měníme Česko k lepšímu',
        link: 'https://cesko.digital',
      },
    ],
    uk: [
      {
        title: 'Pomáhej Ukrajině',
        description: 'Майданчик з пропозиціями допомоги',
        link: 'https://www.pomahejukrajine.cz/ua',
      },
      {
        title: 'Stojíme za Ukrajinou',
        description: 'Незалежний інформаційний довідник',
        link: 'https://www.stojimezaukrajinou.cz/uk',
      },
      {
        title: 'Česko.Digital',
        description: 'Через одиниці і нулі змінюємо Чехію на краще',
        link: 'https://en.cesko.digital/',
      },
    ],
  },
  sk: {
    sk: [
      {
        title: 'Help Ukraine',
        description: 'Portál na sprostredkovanie ponúk pomoci',
        link: 'https://helpukraine.sk/sk/',
      },
      {
        title: 'Ukraine Slovakia',
        description: 'Nezávislý informačný rázcestník',
        link: 'https://www.ukraineslovakia.sk/sk/',
      },
      {
        title: 'Česko.Digital',
        description: 'Cez jednotky a nuly meníme Česko k lepšiemu',
        link: 'https://cesko.digital',
      },
    ],
    uk: [
      {
        title: 'Help Ukraine',
        description: 'Майданчик з пропозиціями допомоги',
        link: 'https://helpukraine.sk/ua/',
      },
      {
        title: 'Ukraine Slovakia',
        description: 'Незалежний інформаційний довідник',
        link: 'https://www.ukraineslovakia.sk/uk/',
      },
      {
        title: 'Česko.Digital',
        description: 'Через одиниці і нулі змінюємо Чехію на краще',
        link: 'https://en.cesko.digital/',
      },
    ],
  },
  pl: {
    pl: [
      {
        title: 'Pomagam Ukrainie',
        description: 'Portal pośredniczący ofertom pomocy',
        link: 'https://pomagamukrainie.gov.pl',
      },
      {
        title: 'Česko.Digital',
        description: 'Przez jedynki i zera zmieniamy Czechy na lepsze (link w języku angielskim)',
        link: 'https://en.cesko.digital/',
      },
    ],
    uk: [
      {
        title: 'Pomagam Ukrainie',
        description: 'Майданчик з пропозиціями допомоги',
        link: 'https://pomagamukrainie.gov.pl/ua',
      },
      {
        title: 'www.gov.pl/ua',
        description: 'Сайт Республіки Польща для громадян України',
        link: 'https://www.gov.pl/web/ua',
      },
      {
        title: 'Česko.Digital',
        description: 'Через одиниці і нулі змінюємо Чехію на краще',
        link: 'https://en.cesko.digital/',
      },
    ],
  },
};
