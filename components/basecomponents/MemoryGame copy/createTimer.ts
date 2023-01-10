// function setTimer: enhanced setTimeout function that saves id of timer
// function clearTimers: deactivates all active timers

const createTimer = (): [(fn: () => void, delay: number) => void, () => void] => {
  let timers: ReturnType<typeof setTimeout>[] = [];

  const setTimer = (fn: () => void, delay: number): void => {
    const currentTimer = setTimeout(() => {
      timers = timers.filter((timer) => timer !== currentTimer);
      fn();
    }, delay);
    timers = [...timers, currentTimer];
  };

  const clearTimers = () => {
    timers.map((t) => clearTimeout(t));
    timers = [];
  };

  return [setTimer, clearTimers];
};

export default createTimer;
