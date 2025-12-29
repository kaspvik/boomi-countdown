import React from "react";
import { GameCard } from "../../layout/GameCard/GameCard";
import { BoomiCardAnim } from "../Boomi/BoomiCardAnimation/BoomiCardAnim";
import styles from "./CardPanel.module.css";

interface BlockCardProps {
  disabled: boolean;
  onClick: () => void;
}

export const BlockCard: React.FC<BlockCardProps> = ({ disabled, onClick }) => {
  return (
    <GameCard disabled={disabled} onClick={onClick}>
      <div className={styles.cardHeader}>
        <h1 className="text-title">Block</h1>
      </div>

      <div className={styles.iconArea}>
        <div className={styles.blockPlaceholder}>
          <BoomiCardAnim anim="block" scale={4} />
        </div>
      </div>

      <h2 className={`text-body ${styles.cardHint}`}>
        Other players can’t pass Boomi to you this round.
      </h2>
    </GameCard>
  );
};
