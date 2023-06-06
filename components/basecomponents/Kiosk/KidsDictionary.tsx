import React, { useEffect, useState, useMemo } from 'react';
import { DictionaryDataObject, fetchDictionary, getKidsCategory } from 'utils/getDataUtils';

import KidsDictionaryList from '../KidsDictionaryList';
import { KidsDictionaryProps, Platform } from '@types';

const KidsDictionary = ({ platform = Platform.WEB }: KidsDictionaryProps) => {
  const [dictionary, setDictionary] = useState<DictionaryDataObject | null>(null);

  useEffect(() => {
    fetchDictionary().then((data) => setDictionary(data));
  }, []);

  const kidsCategory = useMemo(() => {
    if (!dictionary) {
      return null;
    }
    return getKidsCategory(dictionary);
  }, [dictionary]);

  if (!dictionary || !kidsCategory) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-3">
      <KidsDictionaryList kidsCategory={kidsCategory} platform={platform} />
    </div>
  );
};

export default KidsDictionary;
