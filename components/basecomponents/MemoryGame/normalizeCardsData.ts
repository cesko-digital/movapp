import { KidsTranslation } from 'pages/kids/index';
import { CountryVariant, getCountryVariant } from 'utils/locales';

export const normalizeData = ({ main, uk, image }: KidsTranslation) => ({
  translation: {
    uk,
    main,
  },
  image,
});

const normalizeCardsData = (kidsWords: Record<CountryVariant, KidsTranslation[]>) => kidsWords[getCountryVariant()].map(normalizeData);

export default normalizeCardsData;
