import React from "react";
import styles from "./CardPanel.module.css";

interface PassOnCardProps {
  disabled: boolean;
  onClick: () => void;
}

export const PassOnCard: React.FC<PassOnCardProps> = ({
  disabled,
  onClick,
}) => {
  return (
    <button
      type="button"
      className={styles.cardButton}
      onClick={onClick}
      disabled={disabled}>
      <p className="text-title">Pass on</p>

      <div className={styles.boomiPlaceholder}>
        <span className="text-body">Boomi goes here</span>
      </div>

      <p className={`text-body ${styles.cardHint}`}>
        Tap to choose who to pass Boomi to.
      </p>
    </button>
  );
};
