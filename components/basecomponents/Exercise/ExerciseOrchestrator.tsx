import React, { useEffect } from 'react';
import { useLanguage } from 'utils/useLanguageHook';
import { ExerciseType, useExerciseStore, ExerciseStoreStatus } from './exerciseStore';
import { ExerciseIdentification, ExerciseIdentificationComponent } from './ExerciseIdentification';
import { CategoryDataObject } from 'utils/getDataUtils';
import { Button } from 'components/basecomponents/Button';

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
      <div className="flex flex-col items-center">
        <p>settings+options...</p>
        <div>
          {getAllCategories().map(({ id, name }) => (
            <Button
              key={id}
              className={`${selectedCategories.includes(id) ? 'bg-primary-blue' : 'bg-gray-500'}  mr-3`}
              text={name}
              onClick={() => setCategories(computeNewCategories(selectedCategories, id))}
            />
          ))}
        </div>
        <Button className="bg-primary-blue mr-3" text="START" onClick={start} />
      </div>
    );
  }

  if (status === ExerciseStoreStatus.active) {
    if (exercise === null) return <p>waiting for exercise...</p>;
    switch (exercise.type as ExerciseType) {
      case ExerciseType.identification:
        return <ExerciseIdentificationComponent key={exercise.id} exercise={exercise as ExerciseIdentification} />;
      // TODO: add other types of exercises
      default:
        return <p>something went wrong...</p>;
    }
  }

  if (status === ExerciseStoreStatus.completed)
    return (
      // replace with start/setup screen component
      <div className="flex flex-col items-center">
        <p>congrats, session completted...</p>
        <Button className="bg-primary-blue mr-3" text="HOME" onClick={home} />
      </div>
    );

  return <p>something went wrong...</p>;
};
