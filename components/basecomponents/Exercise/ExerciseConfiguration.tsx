import { FunctionComponent, useMemo, useState } from 'react';
import { useExerciseStore } from './exerciseStore';
import { Button } from '../Button';
import { useDebug } from './utils/useDebug';
import { ActionButton } from './components/ActionButton';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../../utils/useLanguageHook';
import { CONFIG_BASE } from './exerciseStoreConfig';

const removeDuplicates = (array: string[]) => {
  return [...new Set(array)];
};

/**
 * ExerciseConfiguration component is responsible for displaying exercise configuration options.
 * To avoid overwhelming the user with too many options, we use metacategories to group categories together.
 * User can select multiple metacategories. Each metacategory contains multiple categories.
 * The resulting categories are passed to Exercise store to be used for generating exercises.
 * Exercise store only deals with categories, all complexity of mapping metacategories to categories is handled here.
 */
const ExerciseConfiguration: FunctionComponent = () => {
  const { currentLanguage } = useLanguage();

  // Categories passed  to Exercise store to be used for generating exercises
  const setCategories = useExerciseStore((state) => state.setCategories);
  const setSize = useExerciseStore((state) => state.setSize);
  const size = useExerciseStore((state) => state.size);

  // User-selected metacategories, each metacategory contains multiple categories
  const [selectedMetaIds, setSelectedMetaIds] = useState<string[]>([]);

  const debug = useDebug();
  const exerciseSizeList = debug ? CONFIG_BASE.debugSizeList : CONFIG_BASE.sizeList;

  // Getting the raw dictionary data from Exercise store for now
  const dictionary = useExerciseStore((state) => state.dictionary);
  const allMetaCategories = useMemo(() => {
    return dictionary?.categories.filter((category) => !category.hidden).filter((category) => category.metacategories.length > 0);
  }, [dictionary]);

  const { t } = useTranslation();

  const clickMetaCategory = (metaId: string) => {
    // Toggle selected metacategory
    let ids = [...selectedMetaIds];
    if (ids.includes(metaId)) {
      ids = ids.filter((metaCategory) => metaCategory !== metaId);
    } else {
      ids = [...ids, metaId];
    }
    setSelectedMetaIds(ids);

    // Use newly updated metacategories to update selected exercise categories in Exercise store
    const newSelectedCategories =
      allMetaCategories
        ?.filter((metacategory) => ids.includes(metacategory.id))
        .map((metacategory) => metacategory.metacategories)
        .flat() ?? [];
    setCategories(removeDuplicates(newSelectedCategories));
  };

  return (
    <div>
      <p className="text-justify mb-5">{t('exercise_page.game_description')}</p>

      <div className="text-sm sm:text-base grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 px-6 justify-stretch justify-items-stretch">
        {allMetaCategories?.map(({ id, name }) => (
          <Button key={id} buttonStyle={selectedMetaIds.includes(id) ? 'choiceCorrect' : 'choice'} onClick={() => clickMetaCategory(id)}>
            {currentLanguage === 'uk' ? name.source : name.main}
          </Button>
        ))}
      </div>
      <p className="text-sm sm:text-base text-center mb-3">{t('exercise_page.size_setup')}:</p>
      <div className="flex items-center justify-center">
        <div className="grid grid-cols-3 gap-4 mb-10 justify-stretch justify-items-stretch">
          {exerciseSizeList.map((val) => (
            <div key={val}>
              <input type="radio" name="size" value={val} id={`size-option-${val}`} onChange={() => setSize(val)} checked={size === val} />{' '}
              <label htmlFor={`size-option-${val}`}>{val}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center mb-12">
        <ActionButton isPlausible exerciseLength={size} action="start" disabled={selectedMetaIds.length === 0} />
      </div>
    </div>
  );
};

export default ExerciseConfiguration;
