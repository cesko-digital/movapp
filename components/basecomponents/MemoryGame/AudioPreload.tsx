import { useEffect } from 'react';

const AudioPreload = ({ src }: { src: string }) => {
  useEffect(() => {
    console.log(`preloading ${src}`);
    const audio = new Audio();
    audio.src = src;
    audio.load();
  }, [src]);

  return <></>;
};

export default AudioPreload;
