import { KidsTranslationsContainer } from './KidsTranslationContainer';
import { normalizeForId } from 'utils/textNormalizationUtils';
import { getCountryVariant } from 'utils/locales';
import { KidsCategoryListProps, Platform } from '@types';

const KidsDictionaryList: React.FC<KidsCategoryListProps> = ({ kidsCategory, platform = Platform.WEB }) => {
  return (
    <>
      {kidsCategory?.translations.map((phrase) => {
        return (
          <KidsTranslationsContainer
            key={phrase.getTranslation('uk')}
            id={normalizeForId(phrase.getTranslation(getCountryVariant()))}
            imageUrl={phrase.getImageUrl()}
            phrase={phrase}
            renderFor={platform}
          />
        );
      })}
    </>
  );
};

export default KidsDictionaryList;
