import React from "react";
import { GameCard } from "../../layout/GameCard/GameCard";
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
    <GameCard disabled={disabled} onClick={onClick}>
      <div className={styles.cardHeader}>
        <p className="text-title">Pass on</p>
      </div>

      <div className={styles.iconArea}>
        <div className={styles.boomiPlaceholder}>
          <span className="text-body">Boomi goes here</span>
        </div>
      </div>

      <p className={`text-body ${styles.cardHint}`}>
        Tap to choose who to pass Boomi to.
      </p>
    </GameCard>
  );
};
