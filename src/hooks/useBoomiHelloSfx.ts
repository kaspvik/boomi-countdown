import { useCallback, useEffect, useRef } from "react";
import { SFX } from "../services/audio/sfx";

const helloKeys = ["hello1", "hello2", "hello3"] as const;

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
  const prevVisibleKeyRef = useRef<string | null>(null);
  const lastHelloForKeyRef = useRef<string | null>(null);

  const playRandomHello = useCallback(() => {
    const key = helloKeys[Math.floor(Math.random() * helloKeys.length)];
    SFX.play(key);
  }, []);

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
