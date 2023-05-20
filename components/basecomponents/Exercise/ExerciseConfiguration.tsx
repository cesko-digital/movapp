import { FunctionComponent, useEffect } from 'react';
import { CONFIG_BASE, useExerciseStore } from './exerciseStore';
import { Button } from '../Button';
import { useDebug } from './utils/useDebug';
import { ActionButton } from './components/ActionButton';
import { CategoryDataObject } from '../../../utils/getDataUtils';
import { useTranslation } from 'react-i18next';

const USE_METACATEGORIES = true;

type ExerciseConfigurationProps = { categoryIds: string[] | undefined };

const ExerciseConfiguration: FunctionComponent<ExerciseConfigurationProps> = (props) => {
  const debug = useDebug();
  const exerciseSizeList = debug ? CONFIG_BASE.debugSizeList : CONFIG_BASE.sizeList;
  const getCategoryNames = useExerciseStore((state) => state.getCategoryNames);
  const getMetacategoryNames = useExerciseStore((state) => state.getMetacategoryNames);
  const selectedCategories = useExerciseStore((state) => state.categories);
  const setSize = useExerciseStore((state) => state.setSize);
  const setCategories = useExerciseStore((state) => state.setCategories);
  const size = useExerciseStore((state) => state.size);

  const { t } = useTranslation();

  const computeNewCategories = (categories: CategoryDataObject['id'][], id: CategoryDataObject['id']) => {
    return categories.includes(id) ? categories.filter((category) => category !== id) : [...categories, id];
  };

  useEffect(() => {
    if (props.categoryIds === undefined || props.categoryIds.length === 0) {
      return;
    }
    setCategories(props.categoryIds);
  }, [setCategories, props.categoryIds]);

  return (
    <div>
      <p className="text-justify mb-5">{t('exercise_page.game_description')}</p>

      <div className="text-sm sm:text-base grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6 px-6 justify-stretch justify-items-stretch">
        {(USE_METACATEGORIES ? getMetacategoryNames() : getCategoryNames()).map(({ id, name }) => (
          <Button
            key={id}
            buttonStyle={selectedCategories.includes(id) ? 'choiceCorrect' : 'choice'}
            onClick={() => setCategories(computeNewCategories(selectedCategories, id))}
          >
            {name}
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
        <ActionButton action="start" disabled={selectedCategories === null || selectedCategories.length === 0} />
      </div>
    </div>
  );
};

export default ExerciseConfiguration;
