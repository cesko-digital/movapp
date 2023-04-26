import { useRef, useState, useEffect } from 'react';
import { Button } from 'components/basecomponents/Button';
import { animation } from '../utils/animation';

interface PlayButtonProps extends React.ComponentProps<typeof Button> {
  play: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>;
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
      onClick={async (e) => {
        if (btnRef.current === null) return;
        if (playing || inactive) return;
        animation.click(btnRef.current);
        const anim = animation.breathe(btnRef.current); // infinite loop animation
        setPlaying(true);
        await play(e);
        anim.restart();
        anim.pause();
        if (mounted.current === false) return;
        setPlaying(false);
      }}
      {...rest}
    />
  );
};
