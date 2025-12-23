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
        <h1 className="text-subtitle">Pass on</h1>
      </div>

      <div className={styles.iconArea}>
        <div className={styles.boomiPlaceholder}>
          <span className="text-subtitle">Boomi goes here</span>
        </div>
      </div>

      <h2 className={`text-subtitle ${styles.cardHint}`}>
        Tap to choose who to pass Boomi to.
      </h2>
    </GameCard>
  );
};
