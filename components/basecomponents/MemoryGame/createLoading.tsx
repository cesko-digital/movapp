/* eslint-disable no-console */
import { useState, useEffect, ImgHTMLAttributes, useCallback } from 'react';

interface LoadingListItem {
  src: string | Promise<string>;
  payload?: HTMLImageElement | HTMLAudioElement;
}

type LoadingList = Record<string, LoadingListItem>;

const createLoading = () => {
  const storage: LoadingList = {};
  let listeners: (() => void)[] = [];

  let loadingPromise: null | Promise<void> = null;
  const getLoadingPromise = () => loadingPromise;

  const createPromise = () =>
    new Promise<void>((resolve) => {
      const onUpdate = () => {
        if (!hasAnyPromise(storage)) {
          resolve();
          loadingPromise = null;
        }
      };

      registerListener(onUpdate);
    });

  const filterPromise = (item: LoadingListItem) => item.src instanceof Promise;
  const hasAnyPromise = (storage: LoadingList) =>
    Object.keys(storage)
      .map((prop) => storage[prop])
      .filter(filterPromise).length > 0;

  const resetStorage = () => {
    //if (!hasAnyPromise(storage)) storage = {};
  };

  const notifyListeners = () => {
    console.log(`listeners notified`);
    listeners.map((item) => item());
  };

  const onPromiseResolved = (src: string) => () => {
    storage[src].src = src;
    console.log(`promise resolved ${src} ,storage has pending promises ${hasAnyPromise(storage)}`);
    // reset storage when loading is complete -> browser checks wheter resource changed after a while, and this request can cause glitches
    resetStorage();
    !hasAnyPromise(storage) && notifyListeners();
  };

  const onPromiseRejected = (src: string) => (error: { message: string }) => {
    // check list
    storage[src].src = src;
    console.warn(error.message);
    // !hasAnyPromise() && listeners.map(item => item())
    resetStorage();
    !hasAnyPromise(storage) && notifyListeners();
    // maybe call listeners
  };

  const registerItem = (src: string, promise: Promise<string>, payload?: HTMLImageElement | HTMLAudioElement) => {
    console.log(`new item ${src} registered`);

    promise.then(onPromiseResolved(src)).catch(onPromiseRejected(src));
    storage[src] = { src: promise, payload };
    if (loadingPromise === null) {
      loadingPromise = createPromise();
      notifyListeners();
    }
  };

  const registerImage = (src: string, img: HTMLImageElement) => {
    /* OVERWRITE SAME SOURCE */
    // const item = getItem(src);
    // if (item !== undefined) {
    //   console.log(`item ${src} already registered`);
    //   return;
    // }

    if (img.complete) return;

    const promise = new Promise<string>((resolve, reject) => {
      img.onload = () => {
        resolve(src);
      };
      img.onerror = () => {
        reject({ message: `image ${src} loading error` });
      };
      // img.src = src;
      setTimeout(() => resolve(src), 10000);
    });

    registerItem(src, promise, img);
  };

  const registerAudio = (src: string, audio: HTMLAudioElement) => {
    if (audio.readyState >= 4) return;

    const promise = new Promise<string>((resolve, reject) => {
      audio.oncanplay = () => {
        resolve(src);
      };
      audio.onerror = () => {
        reject({ message: `audio ${src} loading error` });
      };
      // audio.src = src;
      audio.load();

      setTimeout(() => resolve(src), 10000);
    });

    registerItem(src, promise, audio);
  };

  // const getItem = (src: string) => storage[src];

  const registerListener = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  };

  const isLoadingActive = () => loadingPromise instanceof Promise;

  const useLoading = () => {
    const [loading, setLoading] = useState(isLoadingActive());
    const [loadingPromise, setLoadingPromise] = useState(getLoadingPromise());

    // register to updates
    useEffect(() => {
      const removeListener = registerListener(() => {
        setLoading(isLoadingActive);
        setLoadingPromise(getLoadingPromise);
      });
      return removeListener;
    }, []);

    return { loading, loadingPromise };
  };

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

  const AudioSuspense = ({ src }: { src: string }) => {
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

  const SuspenseKicker = () => {
    const { loading, loadingPromise } = useLoading();

    if (loading && loadingPromise instanceof Promise) throw loadingPromise;
    return null;
  };

  return {
    useLoading,
    ImageSuspense,
    AudioSuspense,
    SuspenseKicker,
  };
};

export default createLoading;
