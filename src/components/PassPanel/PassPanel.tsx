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

  canUsePassCard: boolean;
  canUseBlockCard: boolean;
  onUseBlockCard: () => void;
}

export const PassPanel: React.FC<PassPanelProps> = ({
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
      <div className={styles.cardsRow}>
        <button
          type="button"
          className={styles.cardButton}
          onClick={handlePassOnCardClick}
          disabled={!targets.length || !canUsePassCard}>
          <p className="text-title">Pass on</p>

          <div className={styles.boomiPlaceholder}>
            <span className="text-body">Boomi goes here</span>
          </div>

          <p className={`text-body ${styles.cardHint}`}>
            Tap to choose who to pass Boomi to.
          </p>
        </button>

        <button
          type="button"
          className={styles.cardButton}
          onClick={onUseBlockCard}
          disabled={!canUseBlockCard}>
          <p className="text-title">Block</p>

          <div className={styles.blockPlaceholder}>
            <span className="text-body">Shield icon</span>
          </div>

          <p className="text-body">
            Other players can't pass Boomi to you this round.
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
          disabled={!selectedTargetId || !canUsePassCard}>
          Use card
        </PixelButton>
      </div>
    </div>
  );
};
