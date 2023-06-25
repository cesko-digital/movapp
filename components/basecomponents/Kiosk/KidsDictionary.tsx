import { useMemo } from 'react';

/** Components */
import KidsDictionaryList from '../KidsDictionaryList';

/** Hooks, Types, Utils */
import { useDictionary } from 'components/hooks/useDictionary';
import { getKidsCategory } from 'utils/getDataUtils';

const KidsDictionary = () => {
  const { dictionary, isLoading, error } = useDictionary();

  const kidsCategory = useMemo(() => {
    if (!dictionary) {
      return null;
    }
    return getKidsCategory(dictionary);
  }, [dictionary]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Chyba nacitani dat.</div>;
  }

  return <div className="grid grid-cols-3">{kidsCategory && <KidsDictionaryList kidsCategory={kidsCategory} />}</div>;
};

export default KidsDictionary;
