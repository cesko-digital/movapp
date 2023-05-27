import { NextPage } from 'next';
import Image from 'next/image';
const KioskHome: NextPage = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <Image src="/images/movapp-logo-kiosk.svg" width={186} height={55} alt="Movapp logo" className="mb-14" />
      <div className="games-tiles grid grid-cols-2 gap-6">
        <div className="game-tile">
          <Image src="/images/kiosk/slovicka.png" width={220} height={220} alt="Movapp logo" className="mb-4" />
          <span className="game-name">Slovíčka</span>
        </div>
        <div className="game-tile">Hra2</div>
        <div className="game-tile">Hra3</div>
        <div className="game-tile">Hra4</div>
      </div>
    </div>
  );
};

export default KioskHome;
