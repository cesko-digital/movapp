import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';

import { Modal } from 'components/basecomponents/Modal';
import CountdownCircle from './CountdownCircle';
const InactivityModal = ({ show, stayOnPage, countdownTime }: { show: boolean; stayOnPage: () => void; countdownTime: number }) => {
  const [countdown, setCountdown] = useState<number>(countdownTime / 1000);
  const { t } = useTranslation();

  useEffect(() => {
    const timer =
      show && countdown > 0
        ? setTimeout(() => {
            setCountdown(countdown - 1);
          }, 1000)
        : null;

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [show, countdown]);

  const resetCountdown = () => {
    setCountdown(countdownTime / 1000);
    stayOnPage();
  };

  return (
    <Modal isOpen={show} closeModal={resetCountdown}>
      <div className="flex flex-col content-center items-center pb-10">
        <CountdownCircle countdown={countdown} countdownTime={countdownTime} radius={50} />
        <p className="font-bold text-3xl leading-9 flex items-center text-center text-blue-700 my-10">{t('kiosk.stillHere')}</p>
        <button className="p-4 bg-primary-blue rounded-lg text-white" type="button" onClick={resetCountdown}>
          <span className='font-semibold text-2xl leading-7 text-center text-white"'>{t('kiosk.stayOnPage')}</span>
        </button>
      </div>
    </Modal>
  );
};

export default InactivityModal;
