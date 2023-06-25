import { useRouter } from 'next/router';
import { Platform } from '@types';

export const usePlatform = (): Platform => {
  const router = useRouter();
  return router.asPath.includes('kiosk') ? Platform.KIOSK : Platform.WEB;
};
