const createTimer = () : [(fn: () => void, delay: number) => void, () => void] => {
    
    let timers: ReturnType<typeof setTimeout>[] = [];
  
    const setTimer = (fn: () => void, delay: number) : void => {
      const t = setTimeout(() => {
        timers = timers.filter((e) => e !== t);
        fn();        
      }, delay);
      timers = [...timers, t];      
    };
  
    const clearTimers = () => {
      timers.map((t) => clearTimeout(t));
      timers = [];
    };
  
    return [setTimer, clearTimers];
  };

  export default createTimer;