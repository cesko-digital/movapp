import React, { ImgHTMLAttributes, useCallback } from 'react';
import { registerImage } from './loadingList';

const ImageSuspense = ({ src, ...rest }: { src: string } & ImgHTMLAttributes<HTMLImageElement>) => {
  const loadImg = useCallback(
    (img) => {
      if (img !== null) {
        registerImage(src, img);
      }
    },
    [src]
  );

  return <img ref={loadImg} src={src} {...rest} />;
};

export default ImageSuspense;
