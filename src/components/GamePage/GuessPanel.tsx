import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import type { Player } from "../../types/game";
import styles from "./GuessPanel.module.css";

interface GuessPanelProps {
  targets: Player[];
  selectedTargetId: string | null;
  onSelectTarget: (playerId: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  disabled?: boolean;
}

export const GuessPanel: React.FC<GuessPanelProps> = ({
  targets,
  selectedTargetId,
  onSelectTarget,
  onConfirm,
  onCancel,
  disabled,
}) => {
  const isConfirmDisabled = disabled || !selectedTargetId;

  return (
    <div className={styles.wrapper}>
      <p className="text-subtitle">Who do you think is placing Boomi?</p>

      <ul className={styles.list}>
        {targets.map((p) => {
          const isSelected = p.id === selectedTargetId;
          return (
            <li key={p.id}>
              <button
                type="button"
                className={`${styles.playerButton} ${
                  isSelected ? styles.playerButtonSelected : ""
                }`}
                onClick={() => onSelectTarget(p.id)}
                disabled={disabled}>
                <span className={styles.playerName}>
                  {p.name}
                  {p.isHost ? " (host)" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.buttonRow}>
        <PixelButton
          onClick={onConfirm}
          className="text-button"
          disabled={isConfirmDisabled}>
          Confirm guess
        </PixelButton>

        <PixelButton onClick={onCancel} className="text-button">
          Cancel
        </PixelButton>
      </div>
    </div>
  );
};
