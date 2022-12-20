import React, { ImgHTMLAttributes, useEffect } from 'react';
import loadingList from './loadingList';

const { registerItem, getItem } = loadingList;

const load = (src: string) => {
  console.log(`loading ${src}`);
  const promise = new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(src);
    };
    image.onerror = () => {
      reject({ message: `image ${src} loading error` });
    };
    image.src = src;
  });

  registerItem(src, promise);
  return promise;
};

// const getImage = (src: string) => {
//   const item = getItem(src);
//   // console.log(`item is ${item}`);
//   if (item === undefined) return load(src);
//   if (item instanceof Promise) return item;
//   return item;
// };

const loadImage = (src: string) => {
  const item = getItem(src);
  // console.log(`item is ${item}`);
  if (item === undefined) load(src);
};

const ImageSuspense = ({ src, ...rest }: { src: string } & ImgHTMLAttributes<HTMLImageElement>) => {
  useEffect(() => {
    loadImage(src);
  }, [src]);

  return <img src={src} {...rest} />;
};

export default ImageSuspense;
