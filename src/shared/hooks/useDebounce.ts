import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: 500): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]); //dependency: value chay lai khi value hoac delay thay doi
  return debounced;
}
