import { useLanguage } from './useLanguageHook';
import { usePlausible } from 'next-plausible';

export const useTracking = () => {
  const plausible = usePlausible();
  const lang = useLanguage();

  return { plausible, lang };
};
