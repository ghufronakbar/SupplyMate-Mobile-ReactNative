import { useEffect, useState, useRef } from "react";

type UseDebounceHook = (
  callback: () => void,
  delay: number,
  deps: any[]
) => void;

const useDebounce: UseDebounceHook = (callback, delay, deps) => {
  const [isFirstRender, setIsFirstRender] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isFirstRender) {
      callback();
      setIsFirstRender(false);
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, deps);
};

export default useDebounce;
