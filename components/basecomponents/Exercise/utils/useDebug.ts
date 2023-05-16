import { useRouter } from 'next/router';

export const useDebug = () => {
  const router = useRouter();
  const { debug } = router.query;
  return debug === 'true';
};
