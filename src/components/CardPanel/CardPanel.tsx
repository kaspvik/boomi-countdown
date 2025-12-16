import React, { useState } from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import type { Player } from "../../types/game";
import { BlockCard } from "./BlockCard";
import styles from "./CardPanel.module.css";
import { PassOnCard } from "./PassOnCard";

interface CardPanelProps {
  targets: Player[];
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;
  onConfirm: () => void;
  onCancel: () => void;

  canUsePassCard: boolean;
  canUseBlockCard: boolean;
  onUseBlockCard: () => void;
}

export const CardPanel: React.FC<CardPanelProps> = ({
  targets,
  selectedTargetId,
  onSelectTarget,
  onConfirm,
  canUsePassCard,
  canUseBlockCard,
  onUseBlockCard,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handlePassOnCardClick = () => {
    if (!canUsePassCard) return;
    if (!targets.length) return;
    setIsSelecting(true);
  };

  const handleSelectPlayer = (playerId: string) => {
    onSelectTarget(playerId);
  };

  if (!isSelecting) {
    return (
      <div className={styles.panelWrapper}>
        <div className={styles.cardsRow}>
          <PassOnCard
            disabled={!targets.length || !canUsePassCard}
            onClick={handlePassOnCardClick}
          />

          <BlockCard disabled={!canUseBlockCard} onClick={onUseBlockCard} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.panelWrapper}>
      <div className={styles.container}>
        <p className="text-title">Pass on</p>
        <p className="text-subtitle">
          Tap the player you want to pass Boomi to:
        </p>

        <ul className={styles.playersList}>
          {targets.map((p) => {
            const isSelected = p.id === selectedTargetId;

            return (
              <li key={p.id}>
                <button
                  type="button"
                  className={`${styles.playerItem} ${
                    isSelected ? styles.playerItemSelected : ""
                  }`}
                  onClick={() => handleSelectPlayer(p.id)}>
                  <span className={styles.playerName}>
                    {p.name}
                    {p.isHost ? " (host)" : ""}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className={styles.actions}>
          <PixelButton
            onClick={onConfirm}
            className="text-button"
            disabled={!selectedTargetId || !canUsePassCard}>
            Use card
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
