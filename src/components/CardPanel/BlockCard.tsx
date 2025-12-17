import React from "react";
import { GameCard } from "../../layout/GameCard/GameCard";
import styles from "./CardPanel.module.css";

interface BlockCardProps {
  disabled: boolean;
  onClick: () => void;
}

export const BlockCard: React.FC<BlockCardProps> = ({ disabled, onClick }) => {
  return (
    <GameCard disabled={disabled} onClick={onClick}>
      <div className={styles.cardHeader}>
        <p className="text-subtitle">Block</p>
      </div>

      <div className={styles.iconArea}>
        <div className={styles.blockPlaceholder}>
          <span className="text-subtitle">Shield icon</span>
        </div>
      </div>

      <p className="text-subtitle">
        Other players can’t pass Boomi to you this round.
      </p>
    </GameCard>
  );
};
