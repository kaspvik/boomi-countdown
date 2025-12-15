import React, { useEffect, useState } from "react";
import styles from "./GameTimer.module.css";

interface GameTimerProps {
  durationSeconds: number;
  onTimeout?: () => void;
}

export const GameTimer: React.FC<GameTimerProps> = ({
  durationSeconds,
  onTimeout,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(durationSeconds);

  useEffect(() => {
    setSecondsLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const id = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(id);
  }, [secondsLeft]);

  useEffect(() => {
    if (secondsLeft === 0 && onTimeout) {
      onTimeout();
    }
  }, [secondsLeft, onTimeout]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <span className={styles.value}>{secondsLeft}s</span>
      </div>
    </div>
  );
};
