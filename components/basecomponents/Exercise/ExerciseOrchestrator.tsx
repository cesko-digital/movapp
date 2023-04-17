import React, { useEffect } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { ExerciseType, useExerciseStore, ExerciseStoreStatus } from './exerciseStore';
import { ExerciseIdentification } from './ExerciseIdentification';
import { CategoryDataObject } from 'utils/getDataUtils';
import { Button } from './components/Button';
import { ExerciseIdentificationComponent } from './components/ExerciseIdentificationComponent';
import BetaIcon from 'public/icons/beta.svg';
import dynamic from 'next/dynamic';

const Feedback = dynamic(() => import('../../basecomponents/Feedback'), {
  ssr: false,
});

const computeNewCategories = (categories: CategoryDataObject['id'][], id: CategoryDataObject['id']) =>
  categories.includes(id) ? categories.filter((category) => category !== id) : [...categories, id];

interface ExerciseOrchestratorProps {
  categories: CategoryDataObject['id'][];
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
  //const setSize = useExerciseStore((state) => state.setSize);
  //const setLevel = useExerciseStore((state) => state.setLevel);

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
      <div className="w-80 bg-white">
        <div className="mt-3 mb-5 pr-5">
          <BetaIcon />
        </div>
        <div className="px-5">
          <p className="text-justify mb-5">
            Procvičte si slovíčka a fráze na nejrůznější témata. Nejprve si vyberte tematické okruhy, a můžete začít!
          </p>
          <div className="flex flex-wrap mb-10 justify-stretch">
            {getAllCategories().map(({ id, name }) => (
              <Button
                key={id}
                px="px-2"
                className={`${selectedCategories.includes(id) ? 'bg-primary-blue' : 'bg-gray-500'}  mr-1 mb-1`}
                text={name}
                onClick={() => setCategories(computeNewCategories(selectedCategories, id))}
              />
            ))}
          </div>
          <div className="flex flex-col items-center mb-12">
            <Button text="Spustit cvičení" onClick={start} />
          </div>
        </div>
      </div>
    );
  }

  if (status === ExerciseStoreStatus.active) {
    if (exercise === null) return <p>waiting for exercise...</p>;
    switch (exercise.type as ExerciseType) {
      case ExerciseType.identification:
        return (
          <div className="w-80 bg-white">
            <div className="mt-3 mb-5 pr-5">
              <BetaIcon />
            </div>
            <div className="px-5">
              <ExerciseIdentificationComponent key={exercise.id} exercise={exercise as ExerciseIdentification} />
            </div>
          </div>
        );
      // TODO: add other types of exercises
      default:
        return <p>something went wrong...</p>;
    }
  }

  if (status === ExerciseStoreStatus.completed)
    return (
      <div className="w-80 bg-white">
        <div className="mt-3 mb-5 pr-5">
          <BetaIcon />
        </div>
        <div className="px-5">
          <div className="flex flex-col items-center px-1.5 pt-5 mb-6 bg-slate-50">
            <h4 className="mb-8 font-bold p-0">Gratulujeme!</h4>
            <p className="text-justify">
              Cvičení jste úspěšně zvládli. Nyní můžete pokračovat v procvičování, nebo se vrátit zpět na hlavní stránku.
            </p>
            <div className="flex flex-col items-stretch py-10">
              <Button className="mb-5" text="Pokračovat" onClick={restart} />
              <Button text="Domů" onClick={home} />
            </div>
          </div>
          <Feedback />
        </div>
      </div>
    );

  return <p>something went wrong...</p>;
};
