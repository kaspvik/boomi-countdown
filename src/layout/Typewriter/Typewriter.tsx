import React, { useEffect, useState } from "react";

type TypewriterProps = {
  text: string;
  speedMs?: number;
  startDelayMs?: number;
  cursor?: boolean;
  onDone?: () => void;
};

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  speedMs = 25,
  startDelayMs = 0,
  cursor = true,
  onDone,
}) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    let intervalId: number | undefined;

    const startId = window.setTimeout(() => {
      if (text.length === 0) return;

      intervalId = window.setInterval(() => {
        setI((prev) => {
          const next = prev + 1;
          if (next >= text.length) {
            if (intervalId) window.clearInterval(intervalId);
            onDone?.();
            return text.length;
          }
          return next;
        });
      }, speedMs);
    }, startDelayMs);

    return () => {
      window.clearTimeout(startId);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [text, speedMs, startDelayMs, onDone]);

  return (
    <span style={{ whiteSpace: "pre-wrap" }}>
      {text.slice(0, i)}
      {cursor && i < text.length ? <BlinkCursor /> : null}
    </span>
  );
};

const BlinkCursor = () => (
  <span
    style={{
      display: "inline-block",
      width: "0.3ch",
      marginLeft: "0.1ch",
      animation: "tw-blink 800ms steps(1) infinite",
    }}>
    ▌<style>{`@keyframes tw-blink { 50% { opacity: 0; } }`}</style>
  </span>
);
