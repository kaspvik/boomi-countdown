import React from "react";
import styles from "./CardPanel.module.css";

interface BlockCardProps {
  disabled: boolean;
  onClick: () => void;
}

export const BlockCard: React.FC<BlockCardProps> = ({ disabled, onClick }) => {
  return (
    <button
      type="button"
      className={styles.cardButton}
      onClick={onClick}
      disabled={disabled}>
      <p className="text-title">Block</p>

      <div className={styles.blockPlaceholder}>
        <span className="text-body">Shield icon</span>
      </div>

      <p className="text-body">
        Other players can't pass Boomi to you this round.
      </p>
    </button>
  );
};
