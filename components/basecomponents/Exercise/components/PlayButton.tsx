import { useRef, useState, useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';
import PlayIcon from 'public/icons/playicon.svg';
import SlowPlayIcon from 'public/icons/slowplay.svg';

interface PlayButtonProps extends React.ComponentProps<typeof Button> {
  play: () => Promise<void>;
  inactive?: boolean;
  mode?: 'play' | 'playSlow';
}

export const PlayButton = ({ children, play, mode = 'play', inactive = false, ...rest }: PlayButtonProps) => {
  const [playing, setPlaying] = useState(false);
  const btnRef = useRef(null);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, [mounted]);

  return (
    <Button
      buttonStyle="primary"
      icon
      ref={btnRef}
      {...rest}
      onClick={async () => {
        if (btnRef.current === null) return;
        if (playing || inactive) return;
        const anim = animation.breathe(btnRef.current); // infinite loop animation
        setPlaying(true);
        await play();
        // if got unmounted meanwhile return
        if (mounted.current === false) return;
        setPlaying(false);
        anim.restart();
        anim.pause();
      }}
    >
      {children}
      {mode === 'play' && <PlayIcon className="inline" />}
      {mode === 'playSlow' && <SlowPlayIcon className="inline" />}
    </Button>
  );
};
