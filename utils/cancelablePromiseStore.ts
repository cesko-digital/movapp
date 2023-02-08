const createCancelablePromiseStore = (): [<T>(promise: Promise<T>) => Promise<T>, () => void] => {
  let store: (() => void)[] = [];

  const makeCancelable = <T>(promise: Promise<T>): Promise<T> => {
    let hasCanceled_ = false;

    const cancel = () => {
      hasCanceled_ = true;
    };

    store.push(cancel);

    const remove = () => {
      store = store.filter((func) => func !== cancel);
    };

    const wrappedPromise = new Promise<T>((resolve, reject) => {
      promise.then(
        (val) => {
          remove();
          if (hasCanceled_) {
            reject({ isCanceled: true });
          } else {
            resolve(val);
          }
        },
        (error) => {
          remove();
          if (hasCanceled_) {
            reject({ isCanceled: true });
          } else {
            reject(error);
          }
        }
      );
    });

    return wrappedPromise;
  };

  const cancelAll = () => {
    store.map((cancel) => cancel());
  };

  return [makeCancelable, cancelAll];
};

export default createCancelablePromiseStore;
