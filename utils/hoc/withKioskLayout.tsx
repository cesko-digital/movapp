import { FC } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';

import InactivityModal from 'components/basecomponents/Kiosk/InactivityModal';
import { useInactivityTimeout } from 'utils/useInactivityModal';

const withKioskLayout = (Component: any) => {
  const COUNTDOWN_TIME = 30 * 1000; // How long should the countdown be
  const INACTIVITY_TIME = 5 * 60 * 1000; // How long should the user be inactive before the countdown starts

  const WrappedComponent: FC<JSX.Element> = (props) => {
    const router = useRouter();
    const { showModal, stayOnPage } = useInactivityTimeout(INACTIVITY_TIME, COUNTDOWN_TIME, '/kiosk');

    return (
      <div className="flex flex-row content-start items-start px-[64px]">
        <button
          className="bg-white rounded-[32px] px-[30px] box-shadow h-[120px] w-[120px] drop-shadow-lg"
          type="button"
          onClick={() => router.back()}
        >
          <Image src="/images/kiosk/arrow-back.svg" width={60} height={120} alt="Back" />
        </button>
        <div className="movapp-kiosk-scrollbar grow h-screen overflow-x-scroll">
          <div className="flex justify-center mb-10">
            <Component {...props} />
          </div>
        </div>
        <InactivityModal show={showModal} stayOnPage={stayOnPage} countdownTime={COUNTDOWN_TIME} />
        <Image src="/images/movapp-logo-kiosk.svg" width={187} height={55} alt="Movapp logo" className="ml-6" />
      </div>
    );
  };

  return WrappedComponent;
};

export default withKioskLayout;
