import React, { useState } from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import type { Player } from "../../types/game";
import styles from "./PassPanel.module.css";

interface PassPanelProps {
  targets: Player[];
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PassPanel: React.FC<PassPanelProps> = ({
  targets,
  selectedTargetId,
  onSelectTarget,
  onConfirm,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handleCardClick = () => {
    if (!targets.length) return;
    setIsSelecting(true);
  };

  const handleSelectPlayer = (playerId: string) => {
    onSelectTarget(playerId);
  };

  if (!isSelecting) {
    return (
      <div className={styles.cardWrapper}>
        <button
          type="button"
          className={styles.cardButton}
          onClick={handleCardClick}
          disabled={!targets.length}>
          <p className="text-title">Pass on</p>

          <div className={styles.boomiPlaceholder}>
            <span className="text-body">Boomi goes here</span>
          </div>

          <p className={`text-body ${styles.cardHint}`}>
            Tap to choose who to pass Boomi to.
          </p>
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className="text-title">Pass on</p>
      <p className="text-subtitle">Tap the player you want to pass Boomi to:</p>

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
          disabled={!selectedTargetId}>
          Use card
        </PixelButton>
      </div>
    </div>
  );
};
