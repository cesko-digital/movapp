import { useState, useEffect } from 'react';

let storage: Record<string, Promise<string> | string> = {};
let listeners: (() => void)[] = [];

let loadingPromise: null | Promise<void> = null;
const getLoadingPromise = () => loadingPromise;

const createPromise = () =>
  new Promise<void>((resolve) => {
    const onUpdate = () => {
      if (!isLoadingActive()) {
        resolve();
        loadingPromise = null;
      }
    };

    registerListener(onUpdate);
  });

const filterPromise = (item: Promise<string> | string) => item instanceof Promise;
const hasAnyPromise = (storage: Record<string, Promise<string> | string>) =>
  Object.keys(storage)
    .map((prop) => storage[prop])
    .filter(filterPromise).length > 0;

const onPromiseResolved = (src: string) => () => {
  storage[src] = src;
  // console.log(`promise resolved ${src} ,storage has pending promises ${hasAnyPromise(storage)}`);
  // reset storage wjen loading is complete -> browser checks wheter resource changed after a while, and this request can cause glitches
  if (!hasAnyPromise(storage)) storage = {};
  listeners.map((item) => item());
};

const onPromiseRejected = (src: string) => (error: { message: string }) => {
  // check list
  storage[src] = src;
  console.warn(error.message);
  // !hasAnyPromise() && listeners.map(item => item())
  if (!hasAnyPromise(storage)) storage = {};
  listeners.map((item) => item());
  // maybe call listeners
};

const registerItem = (src: string, promise: Promise<string>) => {
  // console.log(`item ${src} registered`);
  promise.then(onPromiseResolved(src)).catch(onPromiseRejected(src));
  storage[src] = promise;
  if (loadingPromise === null) loadingPromise = createPromise();
  listeners.map((item) => item());
};

const getItem = (src: string) => storage[src];

const registerListener = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((item) => item !== listener);
  };
};

const isLoadingActive = () => hasAnyPromise(storage);

export const useLoading = () => {
  const [loading, setLoading] = useState(isLoadingActive());
  const [loadingPromise, setLoadingPromise] = useState(getLoadingPromise());

  // register to updates
  useEffect(() => {
    const removeListener = registerListener(() => {
      setLoading(isLoadingActive());
      setLoadingPromise(getLoadingPromise());
    });
    return removeListener;
  }, []);

  return [loading, loadingPromise];
};

export default {
  registerListener,
  registerItem,
  getItem,
  isLoadingActive,
  getLoadingPromise,
};
