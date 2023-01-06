import { useCallback } from 'react';

// const AudioPreload = ({ src }: { src: string }) => {
//   useEffect(() => {
//     console.log(`preloading ${src}`);
//     const audio = new Audio();
//     audio.src = src;
//     audio.load();
//   }, [src]);

//   return <></>;
// };

const AudioPreload = ({ src }: { src: string }) => {
  const loadAudio = useCallback(
    (audio) => {
      if (audio !== null) {
        /* eslint-disable-next-line no-console */
        console.log(`preloading ${src}`);
        audio.load();
      }
    },
    [src]
  );

  return <audio hidden ref={loadAudio} src={src} />;
};

export default AudioPreload;
