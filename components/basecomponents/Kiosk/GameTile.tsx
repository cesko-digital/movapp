import Image from 'next/image';
import Link from 'next/link';

import { convertToSlug } from '../../../utils/stringHelpers';

type GameTileProps = {
  name: string;
  image: string;
  title?: string;
};
const GameTile = ({ name, image, title }: GameTileProps) => {
  return (
    <Link href={`/kiosk/game/${convertToSlug(name)}`}>
      <div className="flex flex-col px-[71px] py-[44px] justify-center items-center p-6 bg-white rounded-[60px] drop-shadow-lg">
        <Image src={`/images/kiosk/${image}`} width={220} height={220} alt="Movapp logo" className="mb-4" />
        <span className="font-bold text-3xl leading-9 flex items-center text-center text-blue-700">{title}</span>
      </div>
    </Link>
  );
};

export default GameTile;
