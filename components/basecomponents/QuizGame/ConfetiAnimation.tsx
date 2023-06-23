import { Player } from '@lottiefiles/react-lottie-player';
import * as animationData from './125119-confeti.json';
import useWindowSize from 'components/hooks/useWindowsSize';

const Confetti = () => {
  const { width, height } = useWindowSize();
  return <Player autoplay loop src={animationData} style={{ height, width }} />;
};

export default Confetti;
