import React from 'react';

const storage: Record<string, Promise<string> | string> = {};

const load = (src: string) => {
  console.log(`loading ${src}`);
  const promise = new Promise<string>((resolve, reject) => {
    const audio = new Audio();
    audio.oncanplay = () => {
      resolve(src);
    };
    audio.onerror = () => {
      reject({ message: `audio ${src} loading error` });
    };
    audio.src = src;
    audio.load();
  })
    .then((src) => (storage[src] = src))
    .catch((error) => (storage[src] = error.message));

  storage[src] = promise;
  return promise;
};

const getAudio = (src: string) => {
  if (!storage.hasOwnProperty(src)) throw load(src);
  if (storage[src] instanceof Promise) throw storage[src];
  return storage[src];
};

const AudioSuspense = ({ src }: { src: string }) => {
  getAudio(src);
  return <></>;
};

export default AudioSuspense;
