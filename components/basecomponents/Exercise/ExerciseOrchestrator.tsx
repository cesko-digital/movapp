import React, { useEffect, useRef } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { ExerciseType, useExerciseStore, ExerciseStoreStatus, ExerciseStatus } from './exerciseStore';
import { ExerciseIdentification } from './ExerciseIdentification';
import { CategoryDataObject } from 'utils/getDataUtils';
import { ExerciseIdentificationComponent } from './components/ExerciseIdentificationComponent';
import BetaIcon from 'public/icons/beta.svg';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { Button } from '../Button';
import { ActionButton } from './components/ActionButton';
import Spinner from '../Spinner/Spinner';
import { create } from 'zustand';
import { animation } from './utils/animation';

const USE_METACATEGORIES = true;

interface PendingStore {
  pending: boolean;
  setPending: (val: boolean) => void;
}

export const usePendingStore = create<PendingStore>((set) => ({
  pending: false,
  setPending: (val) => set({ pending: val }),
}));

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
    <div className="w-full sm:w-10/12 max-w-2xl bg-white">
      <div className="flex items-center justify-between mt-3 mb-5 pr-5">
        <BetaIcon />
        <div>{headerContent}</div>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
};

const Loading = () => (
  <AppContainer>
    <div className="flex items-center justify-center">
      <Spinner />
    </div>
  </AppContainer>
);

interface ExerciseOrchestratorProps {
  categories?: string[];
  quickStart?: boolean;
}

// warning: language switching triggers categories props change, probably because staticpaths/props, quickstart isn't change triggered
export const ExerciseOrchestrator = ({ categories, quickStart = false }: ExerciseOrchestratorProps) => {
  const lang = useLanguage();
  const init = useExerciseStore((state) => state.init);
  const cleanUp = useExerciseStore((state) => state.cleanUp);
  const setLang = useExerciseStore((state) => state.setLang);
  const setCategories = useExerciseStore((state) => state.setCategories);
  const getCategoryNames = useExerciseStore((state) => state.getCategoryNames);
  const getMetacategoryNames = useExerciseStore((state) => state.getMetacategoryNames);
  const selectedCategories = useExerciseStore((state) => state.categories);
  const status = useExerciseStore((state) => state.status);
  const exercise = useExerciseStore((state) => state.exercise);
  const restart = useExerciseStore((state) => state.restart);
  const counter = useExerciseStore((state) => state.counter);
  const size = useExerciseStore((state) => state.size);
  const setSize = useExerciseStore((state) => state.setSize);
  const { t } = useTranslation();
  const exerciseRef = useRef(null);
  const nextButtonRef = useRef(null);
  const exerciseStatus = exercise?.status;

  useEffect(() => {
    setLang(lang);
  }, [setLang, lang]);

  useEffect(() => {
    if (categories === undefined || categories.length === 0) return;
    setCategories(categories);
  }, [setCategories, categories]);

  useEffect(() => {
    init(quickStart === true);
    return () => {
      cleanUp();
    };
  }, [init, cleanUp, quickStart]);

  // animate elements on Exercise.complete
  useEffect(() => {
    if (exerciseStatus === ExerciseStatus.completed) {
      if (nextButtonRef.current === null) return;
      animation.grow(nextButtonRef.current);
    }
  }, [exerciseStatus]);

  // clear pending
  // useEffect(() => {
  //   setPending(false);
  // }, [setPending, status]);

  if (status === ExerciseStoreStatus.uninitialized) return <Loading />;

  if (status === ExerciseStoreStatus.initialized) {
    return (
      // replace with start/setup screen component
      <AppContainer>
        <p className="text-justify mb-5">{t('utils.game_description')}</p>
        {/* To-do make all these buttons outlined/secondary */}
        {/* <div>
          <ActionButton buttonStyle="primaryLight" className="mb-3" onClick={() => setCategories(getAllCategories().map((cat) => cat.id))}>
            {t('utils.select_all')}
          </ActionButton>
        </div>
        <div>
          <ActionButton buttonStyle="primaryLight" className="mb-3" onClick={() => setCategories([])}>
            {t('utils.clear_all')}
          </ActionButton>
        </div>
        <div>
          <ActionButton
            buttonStyle="primaryLight"
            className="mb-3"
            onClick={() =>
              setCategories(
                getAllCategories()
                  .map((cat) => cat.id)
                  .filter(() => Math.random() > 0.5)
              )
            }
          >
            {t('utils.pick_random')}
          </ActionButton>
        </div> */}
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
        <p className="text-sm sm:text-base text-center mb-3">Nastavte si délku cvičení:</p>
        <div className="flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 mb-10 justify-stretch justify-items-stretch">
            {[3, 5, 10].map((val) => (
              <div key={val}>
                <input
                  type="radio"
                  name="size"
                  value={val}
                  id={`size-option-${val}`}
                  onChange={() => setSize(val)}
                  checked={size === val}
                />{' '}
                <label htmlFor={`size-option-${val}`}>{val}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center mb-12">
          <ActionButton action="start" disabled={selectedCategories === null || selectedCategories.length === 0} />
        </div>
      </AppContainer>
    );
  }

  if (status === ExerciseStoreStatus.active) {
    if (exercise === null) return <Loading />;
    switch (exercise.type as ExerciseType) {
      case ExerciseType.identification:
        return (
          <AppContainer headerContent={`${counter}/${size}`}>
            <ExerciseIdentificationComponent ref={exerciseRef} key={exercise.id} exercise={exercise as ExerciseIdentification} />
            {/* Todo: style this appropriately, but you always need a back button here */}
            <div className="flex justify-between w-full">
              <ActionButton buttonStyle="primaryLight" action="home" />
              <ActionButton
                key={exercise.id}
                ref={nextButtonRef}
                action="nextExercise"
                className={exercise.status === ExerciseStatus.completed ? 'visible' : 'invisible'}
                // disabled={!(exercise.status === ExerciseStatus.completed)}
                onClickAsync={async () => {
                  if (exerciseRef.current === null || nextButtonRef.current === null) return;
                  animation.diminish(nextButtonRef.current, 300);
                  await animation.fade(exerciseRef.current, 300).finished;
                }}
              />
            </div>
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
        <div className="flex flex-col items-center px-1.5 sm:px-3 pt-5 mb-6 bg-slate-50">
          <h4 className="mb-8 font-bold p-0">{t('utils.congratulations')}</h4>
          <p className="text-justify">{t('utils.you_have_finished')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 justify-stretch justify-items-stretch py-10">
            <ActionButton onClickAsync={restart}>{t('utils.next') || ''}</ActionButton>
            <ActionButton action="home" />
          </div>
        </div>
        <Feedback />
      </AppContainer>
    );

  return <p>something went wrong...</p>;
};
