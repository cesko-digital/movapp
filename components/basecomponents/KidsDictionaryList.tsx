/* Components */
import KidsTranslationContainer from './KidsTranslationContainer';

/* Hooks, Types, Utils */
import { normalizeForId } from 'utils/textNormalizationUtils';
import { getCountryVariant } from 'utils/locales';
import { KidsCategoryListProps } from '@types';

const KidsDictionaryList: React.FC<KidsCategoryListProps> = ({ kidsCategory }) => {
  if (!kidsCategory?.translations) {
    return null;
  }

  return (
    <>
      {kidsCategory.translations.map((phrase, index) => (
        <KidsTranslationContainer
          key={`${phrase.getTranslation('uk')}-${index}`}
          id={normalizeForId(phrase.getTranslation(getCountryVariant()))}
          imageUrl={phrase.getImageUrl()}
          phrase={phrase}
        />
      ))}
    </>
  );
};

export default KidsDictionaryList;
