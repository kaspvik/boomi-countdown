import React from "react";
import { GameCard } from "../../layout/GameCard/GameCard";
import { BoomiCardAnim } from "../Boomi/BoomiCardAnimation/BoomiCardAnim";
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
        <h1 className="text-title">Pass on</h1>
      </div>

      <div className={styles.iconArea}>
        <div className={styles.boomiPlaceholder}>
          <BoomiCardAnim anim="pass" scale={4} />
        </div>
      </div>

      <h2 className={`text-title ${styles.cardHint}`}>
        Tap to choose who to pass Boomi to.
      </h2>
    </GameCard>
  );
};
