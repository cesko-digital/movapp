const createCancelablePromiseStore = (): [(promise: Promise<unknown>) => Promise<unknown>, () => void] => {
  let store: (() => void)[] = [];

  const makeCancelable = (promise: Promise<unknown>) => {
    let hasCanceled_ = false;

    const cancel = () => {
      hasCanceled_ = true;
    };

    store.push(cancel);

    const remove = () => {
      store = store.filter((func) => func !== cancel);
    };

    const wrappedPromise = new Promise((resolve, reject) => {
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
