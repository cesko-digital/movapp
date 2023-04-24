import React, { useEffect } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { ExerciseType, useExerciseStore, ExerciseStoreStatus } from './exerciseStore';
import { ExerciseIdentification } from './ExerciseIdentification';
import { CategoryDataObject } from 'utils/getDataUtils';
import { ExerciseIdentificationComponent } from './components/ExerciseIdentificationComponent';
import BetaIcon from 'public/icons/beta.svg';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';

const Feedback = dynamic(() => import('../../basecomponents/Feedback'), {
  ssr: false,
});

const computeNewCategories = (categories: CategoryDataObject['id'][], id: CategoryDataObject['id']) =>
  categories.includes(id) ? categories.filter((category) => category !== id) : [...categories, id];

interface AppContainerProps {
  headerContent?: React.ReactNode;
  children: React.ReactNode;
}

const AppContainer: React.FunctionComponent<AppContainerProps> = ({ children, headerContent }) => {
  return (
    <div className="w-80 bg-white">
      <div className="flex items-center justify-between mt-3 mb-5 pr-5">
        <BetaIcon />
        <div>{headerContent}</div>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
};

interface ExerciseOrchestratorProps {
  categories: string[];
}

// warning: language switching triggers change for all props
export const ExerciseOrchestrator = ({ categories }: ExerciseOrchestratorProps) => {
  const lang = useLanguage();
  const init = useExerciseStore((state) => state.init);
  const setLang = useExerciseStore((state) => state.setLang);
  const setCategories = useExerciseStore((state) => state.setCategories);
  const getAllCategories = useExerciseStore((state) => state.getAllCategories);
  const selectedCategories = useExerciseStore((state) => state.categories);
  const status = useExerciseStore((state) => state.status);
  const exercise = useExerciseStore((state) => state.exercise);
  const start = useExerciseStore((state) => state.start);
  const restart = useExerciseStore((state) => state.restart);
  const home = useExerciseStore((state) => state.home);
  const counter = useExerciseStore((state) => state.counter);
  const size = useExerciseStore((state) => state.size);
  //const setSize = useExerciseStore((state) => state.setSize);
  //const setLevel = useExerciseStore((state) => state.setLevel);
  const { t } = useTranslation();

  useEffect(() => {
    setLang(lang);
  }, [setLang, lang]);

  useEffect(() => {
    setCategories(categories);
  }, [setCategories, categories]);

  useEffect(() => {
    init();
  }, [init]);

  if (status === ExerciseStoreStatus.uninitialized) return <p>waiting for init...</p>;

  if (status === ExerciseStoreStatus.initialized) {
    if (selectedCategories === null) return <p>waiting for init...</p>;
    return (
      // replace with start/setup screen component
      <AppContainer>
        <p className="text-justify mb-5">{t('utils.game_description')}</p>
        {/* To-do make all these buttons outlined/secondary */}
        <div>
          <Button
            className="mb-3 bg-white"
            text={t('utils.select_all')}
            onClick={() => setCategories(getAllCategories().map((cat) => cat.id))}
          />
        </div>
        <div>
          <Button className="mb-3 bg-white" text={t('utils.clear_all')} onClick={() => setCategories([])} />
        </div>
        <div>
          <Button
            className="mb-3 bg-white"
            text={t('utils.pick_random')}
            onClick={() =>
              setCategories(
                getAllCategories()
                  .map((cat) => cat.id)
                  .filter(() => Math.random() > 0.5)
              )
            }
          />
        </div>
        <div className="flex flex-wrap mb-10 justify-stretch">
          {getAllCategories().map(({ id, name }) => (
            <Button
              key={id}
              className={`${selectedCategories.includes(id) ? 'bg-primary-blue' : 'bg-gray-500'}  mr-1 mb-1`}
              onClick={() => setCategories(computeNewCategories(selectedCategories, id))}
            >
              {name}
            </Button>
          ))}
        </div>
        <div className="flex flex-col items-center mb-12">
          <Button className="bg-primary-blue" onClick={start}>
            {t('utils.play_the_game') || ''}
          </Button>
        </div>
      </AppContainer>
    );
  }

  if (status === ExerciseStoreStatus.active) {
    if (exercise === null) return <p>waiting for exercise...</p>;
    switch (exercise.type as ExerciseType) {
      case ExerciseType.identification:
        return (
          <AppContainer headerContent={`${counter}/${size}`}>
            <ExerciseIdentificationComponent key={exercise.id} exercise={exercise as ExerciseIdentification} />
            {/* Todo: style this appropriately, but you always need a back button here */}
            <Button text={t('utils.home') || ''} onClick={home} />
          </AppContainer>
        );
      // TODO: add other types of exercises
      default:
        return <p>something went wrong...</p>;
    }
  }

  if (status === ExerciseStoreStatus.completed)
    return (
      <AppContainer>
        <div className="flex flex-col items-center px-1.5 pt-5 mb-6 bg-slate-50">
          <h4 className="mb-8 font-bold p-0">{t('utils.congratulations')}</h4>
          <p className="text-justify">{t('utils.you_have_finished')}</p>
          <div className="flex flex-col items-stretch py-10">
            <Button className="mb-5 bg-primary-blue" onClick={restart}>
              {t('utils.next') || ''}
            </Button>
            <Button className="bg-primary-blue" onClick={home}>
              {t('utils.home') || ''}
            </Button>
          </div>
        </div>
        <Feedback />
      </AppContainer>
    );

  return <p>something went wrong...</p>;
};
