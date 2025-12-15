import React from "react";
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
  onCancel,
}) => {
  return (
    <div className={styles.container}>
      <p className="text-title">Pass Boomi card</p>
      <p className="text-body">
        Choose a player to secretly pass Boomi to. This will shorten the round
        by 5 seconds.
      </p>

      <ul className={styles.list}>
        {targets.map((player) => (
          <li
            key={player.id}
            className={`${styles.item} ${
              selectedTargetId === player.id ? styles.itemSelected : ""
            }`}>
            <button
              type="button"
              onClick={() => onSelectTarget(player.id)}
              className={styles.itemButton}>
              <span className="text-body">{player.name}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className={styles.actions}>
        <PixelButton onClick={onCancel} className="text-button">
          Cancel
        </PixelButton>
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
