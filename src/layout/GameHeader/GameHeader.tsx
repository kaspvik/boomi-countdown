import React from "react";
import { LeaveButton } from "../LeaveButton/LeaveButton";
import styles from "./GameHeader.module.css";

interface GameHeaderProps {
  onLeave: () => void;

  center: React.ReactNode;

  right?: React.ReactNode;

  leaveLabel?: string;
  leaveDisabled?: boolean;

  className?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onLeave,
  center,
  right,
  leaveLabel = "Leave game",
  leaveDisabled = false,
  className,
}) => {
  const rootClassName = [styles.bar, className].filter(Boolean).join(" ");

  return (
    <header className={rootClassName}>
      <div className={styles.left}>
        <LeaveButton
          onClick={onLeave}
          disabled={leaveDisabled}
          label={leaveLabel}
        />
      </div>

      <div className={styles.center}>{center}</div>

      <div className={styles.right}>{right ?? <span aria-hidden="true" />}</div>
    </header>
  );
};
