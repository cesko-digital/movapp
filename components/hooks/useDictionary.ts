import { useState, useEffect } from 'react';

import { DictionaryDataObject, fetchDictionary } from 'utils/getDataUtils';
export const useDictionary = () => {
  const [dictionary, setDictionary] = useState<DictionaryDataObject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDictionary();
        setDictionary(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return { dictionary, isLoading, error };
};
