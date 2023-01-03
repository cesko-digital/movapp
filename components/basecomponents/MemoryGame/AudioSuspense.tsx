import React, { useCallback } from 'react';
import { registerAudio } from './loadingList';

// const AudioSuspense = ({ src }: { src: string }) => {
//   useEffect(() => {
//     registerAudio(src);
//   }, [src]);
//   return <></>;
// };

const AudioSuspenseRef = ({ src }: { src: string }) => {
  const loadAudio = useCallback(
    (audio) => {
      if (audio !== null) {
        registerAudio(src, audio);
      }
    },
    [src]
  );

  return <audio hidden ref={loadAudio} src={src} />;
};

export default AudioSuspenseRef;
