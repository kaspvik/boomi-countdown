import { useCallback, useEffect, useRef } from "react";

export function useKeyTrigger(key?: string) {
  const last = useRef<string | undefined>(undefined);
  const pending = useRef(false);

  useEffect(() => {
    if (!key) return;
    if (last.current === key) return;
    last.current = key;
    pending.current = true;
  }, [key]);

  const consume = useCallback((): boolean => {
    if (!pending.current) return false;
    pending.current = false;
    return true;
  }, []);

  return { consume };
}
