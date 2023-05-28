import { useState, useEffect, useRef } from 'react';
import Router from 'next/router';

export const useInactivityTimeout: any = (inactivityTime: number, actionTime: number, homeUrl: string) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const inactivityTimeout = useRef<number | null>(null);
  const actionTimeout = useRef<number | null>(null);

  const resetInactivityTimeout = () => {
    if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
    inactivityTimeout.current = window.setTimeout(() => setShowModal(true), inactivityTime);
  };

  const stayOnPage = () => {
    if (actionTimeout.current) clearTimeout(actionTimeout.current);
    setShowModal(false);
    resetInactivityTimeout();
  };

  const leavePage = () => Router.push(homeUrl);

  useEffect(() => {
    resetInactivityTimeout();
    document.addEventListener('mousemove', resetInactivityTimeout, false);

    return () => {
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      if (actionTimeout.current) clearTimeout(actionTimeout.current);
      document.removeEventListener('mousemove', resetInactivityTimeout, false);
    };
  }, [resetInactivityTimeout]);

  useEffect(() => {
    if (showModal) {
      actionTimeout.current = window.setTimeout(leavePage, actionTime);
    }
  }, [showModal]);

  return { showModal, stayOnPage };
};
