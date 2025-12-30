import { useEffect, useRef } from "react";
import { useSoundStore } from "../../store/soundStore";

type Options = {
  boomiOnTable: boolean;
  visibleKey: string;
  playOnHolderChange?: boolean;
};

export const useBoomiHelloSfx = ({
  boomiOnTable,
  visibleKey,
  playOnHolderChange = true,
}: Options) => {
  const playRandomHello = useSoundStore((s) => s.playRandomHello);

  const prevVisibleKeyRef = useRef<string | null>(null);
  const lastHelloForKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!boomiOnTable) {
      prevVisibleKeyRef.current = null;
      lastHelloForKeyRef.current = null;
      return;
    }

    const prev = prevVisibleKeyRef.current;
    prevVisibleKeyRef.current = visibleKey;

    const shouldPlay =
      prev === null || (playOnHolderChange && prev !== visibleKey);

    if (!shouldPlay) return;

    if (lastHelloForKeyRef.current === visibleKey) return;

    lastHelloForKeyRef.current = visibleKey;
    playRandomHello();
  }, [boomiOnTable, visibleKey, playOnHolderChange, playRandomHello]);
};
