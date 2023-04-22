import { useRef, useState, useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';

interface PlayButtonProps {
  play: () => Promise<void>;
  text: React.ReactNode;
  inactive?: boolean;
}

export const PlayButton = ({ play, text, inactive = false }: PlayButtonProps) => {
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
      className="bg-primary-blue mr-3"
      ref={btnRef}
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
      {text}
    </Button>
  );
};
