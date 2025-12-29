import React, { useEffect, useRef, useState } from "react";
import styles from "./GameTimer.module.css";

type FireTimestampLike = { toMillis: () => number };

interface GameTimerProps {
  durationSeconds: number;
  mode?: "server" | "local";
  startedAt?: FireTimestampLike | null;
  penaltySeconds?: number;

  onTimeout?: () => void;
  onTick?: (secondsLeft: number) => void;
}

function calcSecondsLeft(
  startedAtMs: number,
  durationSeconds: number,
  penalty: number
) {
  const nowMs = Date.now();
  const elapsed = Math.floor((nowMs - startedAtMs) / 1000);

  const total = Math.max(0, durationSeconds - penalty);
  return Math.max(0, total - elapsed);
}

export const GameTimer: React.FC<GameTimerProps> = ({
  durationSeconds,
  mode = "server",
  startedAt = null,
  penaltySeconds = 0,
  onTimeout,
  onTick,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(durationSeconds);

  const didTimeoutRef = useRef(false);
  const lastReportedRef = useRef<number | null>(null);

  useEffect(() => {
    didTimeoutRef.current = false;
    lastReportedRef.current = null;

    let startedAtMs: number | null = null;

    if (mode === "server") {
      if (!startedAt) {
        return;
      }
      startedAtMs = startedAt.toMillis();
    } else {
      startedAtMs = null;
    }

    const startLocal = () => {
      startedAtMs = Date.now();
      tick();
    };

    const tick = () => {
      if (startedAtMs === null) return;

      const next = calcSecondsLeft(
        startedAtMs,
        durationSeconds,
        penaltySeconds
      );
      setSecondsLeft(next);

      if (lastReportedRef.current !== next) {
        lastReportedRef.current = next;
        onTick?.(next);
      }

      if (next === 0 && onTimeout && !didTimeoutRef.current) {
        didTimeoutRef.current = true;
        onTimeout();
      }
    };

    if (mode === "local") {
      Promise.resolve().then(startLocal);
    } else {
      Promise.resolve().then(tick);
    }

    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [mode, startedAt, durationSeconds, penaltySeconds, onTick, onTimeout]);

  const displaySeconds =
    mode === "server" && !startedAt
      ? Math.max(0, durationSeconds - penaltySeconds)
      : secondsLeft;

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <span className={styles.value}>{displaySeconds}s</span>
      </div>
    </div>
  );
};
