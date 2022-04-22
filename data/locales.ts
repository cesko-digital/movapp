export type Language = 'cs' | 'sk' | 'pl' | 'uk';
type Locale = {
  name: string;
  locale: Language;
};

export const LOCALES: Locale[] = [
  {
    name: 'Укр',
    locale: 'uk',
  },
  {
    name: 'Česky',
    locale: 'cs',
  },
];
