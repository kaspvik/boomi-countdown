import React from "react";
import styles from "./GameCard.module.css";

interface GameCardProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const GameCard: React.FC<GameCardProps> = ({
  onClick,
  disabled,
  children,
}) => {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}>
      <div className={styles.inner}>{children}</div>
    </button>
  );
};
