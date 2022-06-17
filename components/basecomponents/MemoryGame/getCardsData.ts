import { KidsTranslation } from 'pages/kids/index';
import { getCountryVariant } from 'utils/locales';
import kidsWords_CS from 'data/translations/cs/pro-deti.json';
import kidsWords_SK from 'data/translations/sk/pro-deti_sk.json';
import kidsWords_PL from 'data/translations/pl/pro-deti_pl.json';

const KIDS_WORDS = {
  cs: kidsWords_CS,
  sk: kidsWords_SK,
  pl: kidsWords_PL,
};

export const normalizeData = ({ main, uk, image }: KidsTranslation) => ({
  translation: {
    uk,
    main,
  },
  image,
});

const getCardsData = () => KIDS_WORDS[getCountryVariant()].map(normalizeData);

export default getCardsData;
