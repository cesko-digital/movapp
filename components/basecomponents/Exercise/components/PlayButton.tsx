import { useRef, useState, useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';

interface PlayButtonProps extends React.ComponentProps<typeof Button> {
  play: () => Promise<void>;
  inactive?: boolean;
}

export const PlayButton = ({ play, inactive = false, ...rest }: PlayButtonProps) => {
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
      {...rest}
    />
  );
};
