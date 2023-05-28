import { NextPage } from 'next';
import Image from 'next/image';

/** Components */
import GameTile from '../../components/basecomponents/Kiosk/GameTile';

const KioskHome: NextPage = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <Image src="/images/movapp-logo-kiosk.svg" width={186} height={55} alt="Movapp logo" className="mb-14" />
      <div className="grid grid-cols-2 gap-6">
        <GameTile name="Slovíčka" image="slovicka.png" />
        <GameTile name="Pexeso" image="pexeso.png" />
        <GameTile name="Stories" image="pohadky.png" />
        <GameTile name="Obrazkovy kviz" image="kviz.png" />
      </div>
    </div>
  );
};

export default KioskHome;
