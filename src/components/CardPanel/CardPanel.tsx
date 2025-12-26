import React, { useState } from "react";
import { PlayerSelectPanel } from "../../layout/PlayerSelectPanel/PlayerSelectPanel";
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

  requestBoomiExit: (afterExit: () => void) => void;
}

export const CardPanel: React.FC<CardPanelProps> = ({
  targets,
  selectedTargetId,
  onSelectTarget,
  onConfirm,
  onCancel,
  canUsePassCard,
  canUseBlockCard,
  onUseBlockCard,
  requestBoomiExit,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handlePassOnCardClick = () => {
    if (!canUsePassCard) return;
    if (!targets.length) return;
    setIsSelecting(true);
  };

  const handleConfirmPass = () => {
    if (!canUsePassCard || !selectedTargetId) return;

    requestBoomiExit(() => {
      onConfirm();
      setIsSelecting(false);
    });
  };

  const handleBack = () => {
    setIsSelecting(false);
    onCancel();
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
      <PlayerSelectPanel
        headerLabel="Tap the player you want to pass Boomi to:"
        targets={targets}
        selectedTargetId={selectedTargetId}
        onSelectTarget={onSelectTarget}
        confirmLabel="Use card"
        onConfirm={handleConfirmPass}
        confirmDisabled={!selectedTargetId || !canUsePassCard}
        onSecondary={handleBack}
        secondaryDisabled={false}
        disabled={!canUsePassCard}
      />
    </div>
  );
};
