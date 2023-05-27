import { useRouter } from 'next/router';
import MemoryGame from 'components/basecomponents/MemoryGame/MemoryGame';
import Image from 'next/image';
const Game = () => {
  const router = useRouter();
  const { name } = router.query;

  return (
    <div className="flex flex-row content-start items-start px-[64px]">
      <button className="bg-white rounded-[32px] px-[30px] box-shadow h-[120px] w-[120px]" type="button" onClick={() => router.back()}>
        <Image src="/images/kiosk/arrow-back.svg" width={60} height={120} alt="Back" />
      </button>
      <div className="grow">
        <MemoryGame />
      </div>
      <Image src="/images/movapp-logo-kiosk.svg" width={187} height={55} alt="Movapp logo" className="ml-6" />
    </div>
  );
};

export default Game;
