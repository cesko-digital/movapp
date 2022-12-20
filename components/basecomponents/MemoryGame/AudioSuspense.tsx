import React, { useEffect } from 'react';
import loadingList from './loadingList';

const { registerItem, getItem } = loadingList;

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
  });

  registerItem(src, promise);
  return promise;
};

const loadAudio = (src: string) => {
  const item = getItem(src);
  // console.log(`item is ${item}`);
  if (item === undefined) load(src);
};

const AudioSuspense = ({ src }: { src: string }) => {
  useEffect(() => {
    loadAudio(src);
  }, [src]);
  return <></>;
};

export default AudioSuspense;
