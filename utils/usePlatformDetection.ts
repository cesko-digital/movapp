import { useRouter } from 'next/router';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { currentPlatformAtom } from 'components/basecomponents/Kiosk/atoms';
import { Platform } from '@types';

export const usePlatformDetection = (): void => {
  const router = useRouter();
  const setCurrentPlatform = useSetAtom(currentPlatformAtom);

  useEffect(() => {
    if (router.asPath.includes('kiosk')) {
      setCurrentPlatform(Platform.KIOSK);
    }
  }, [router.asPath, setCurrentPlatform]);
};
