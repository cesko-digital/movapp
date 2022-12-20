import { useEffect } from 'react';
import loadingList from './loadingList';
import { useLoading } from './loadingList';

const SuspenseKicker = ({ delay }: { delay: number }) => {
  const [loading, loadingPromise] = useLoading();

  useEffect(() => {
    console.log('setting init promise');
    const promise = new Promise<string>((resolve) =>
      setTimeout(() => {
        console.log('init promise resolved');
        resolve('initialLoadingPromise');
      }, delay)
    );
    loadingList.registerItem('initialLoadingPromise', promise);
  }, []);

  if (loading && loadingPromise instanceof Promise) throw loadingPromise;
  return null;
};

export default SuspenseKicker;
