import React from "react";
import { GameTimer } from "../GameTimer/GameTimer";
import { LeaveButton } from "../LeaveButton/LeaveButton";
import styles from "./GameHeader.module.css";

type GameHeaderMode = "flow" | "overlay";

interface GameHeaderProps {
  onLeave?: () => void;

  timer?: {
    key?: string;
    durationSeconds: number;
    onTimeout: () => void;
    onTick?: (secondsLeft: number) => void;
  };

  right?: React.ReactNode;

  leaveLabel?: string;
  leaveDisabled?: boolean;
  mode?: GameHeaderMode;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onLeave,
  timer,
  right,
  mode = "flow",
  leaveLabel = "Leave game",
  leaveDisabled = false,
}) => {
  const showLeave = !!onLeave;

  return (
    <header
      className={`${styles.wrapper} ${
        mode === "overlay" ? styles.overlay : ""
      }`}>
      <div className={styles.bar}>
        <div className={styles.left}>
          {showLeave ? (
            <LeaveButton
              onClick={onLeave}
              disabled={leaveDisabled}
              label={leaveLabel}
            />
          ) : (
            <span className={styles.leftPlaceholder} aria-hidden="true" />
          )}
        </div>

        <div className={styles.center}>
          {timer ? (
            <GameTimer
              key={timer.key}
              durationSeconds={timer.durationSeconds}
              onTimeout={timer.onTimeout}
              onTick={timer.onTick}
            />
          ) : (
            <span aria-hidden="true" />
          )}
        </div>

        <div className={styles.right}>
          {right ?? (
            <span className={styles.rightPlaceholder} aria-hidden="true" />
          )}
        </div>
      </div>
    </header>
  );
};
