import { useLoading } from './loadingList';

const SuspenseKicker = () => {
  const [loading, loadingPromise] = useLoading();

  if (loading && loadingPromise instanceof Promise) throw loadingPromise;
  return null;
};

export default SuspenseKicker;
