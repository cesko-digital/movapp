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
        description: 'footer.help_ukraine_description',
        link: 'https://www.pomahejukrajine.cz',
      },
      {
        title: 'Stojíme za Ukrajinou',
        description: 'footer.stand_with_ukraine_description',
        link: 'https://www.stojimezaukrajinou.cz',
      },
      {
        title: 'Česko.Digital',
        description: 'footer.czech_digital',
        link: 'https://cesko.digital',
      },
    ],
    uk: [
      {
        title: 'Pomáhej Ukrajině',
        description: 'footer.help_ukraine_description',
        link: 'https://www.pomahejukrajine.cz/ua',
      },
      {
        title: 'Stojíme za Ukrajinou',
        description: 'footer.stand_with_ukraine_description',
        link: 'https://www.stojimezaukrajinou.cz/uk',
      },
      {
        title: 'Česko.Digital',
        description: 'footer.czech_digital',
        link: 'https://cesko.digital/en',
      },
    ],
  },
  sk: {
    sk: [
      {
        title: 'Help Ukraine',
        description: 'footer.help_ukraine_description',
        link: 'https://helpukraine.sk/sk/',
      },
      {
        title: 'Ukraine Slovakia',
        description: 'footer.stand_with_ukraine_description',
        link: 'https://www.ukraineslovakia.sk/sk/homepage/',
      },
      {
        title: 'Česko.Digital',
        description: 'footer.czech_digital',
        link: 'https://cesko.digital',
      },
    ],
    uk: [
      {
        title: 'Help Ukraine',
        description: 'footer.help_ukraine_description',
        link: 'https://helpukraine.sk/ua/',
      },
      {
        title: 'Ukraine Slovakia',
        description: 'footer.stand_with_ukraine_description',
        link: 'https://www.ukraineslovakia.sk/',
      },
      {
        title: 'Česko.Digital',
        description: 'footer.czech_digital',
        link: 'https://cesko.digital/en',
      },
    ],
  },
  pl: {
    pl: [
      {
        title: 'Pomagam Ukrainie',
        description: 'footer.help_ukraine_description',
        link: 'https://pomagamukrainie.gov.pl',
      },
      {
        title: 'Česko.Digital',
        description: 'footer.czech_digital',
        link: 'https://cesko.digital/en',
      },
    ],
    uk: [
      {
        title: 'Pomagam Ukrainie',
        description: 'footer.help_ukraine_description',
        link: 'https://pomagamukrainie.gov.pl/ua',
      },
      {
        title: 'www.gov.pl/ua',
        description: 'Сайт Республіки Польща для громадян України',
        link: 'https://www.gov.pl/web/ua',
      },
      {
        title: 'Česko.Digital',
        description: 'footer.czech_digital',
        link: 'https://cesko.digital/en',
      },
    ],
  },
};
