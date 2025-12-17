import React from "react";
import { PlayerSelectPanel } from "../../layout/PlayerSelectPanel/PlayerSelectPanel";
import type { Player } from "../../types/game";

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
  disabled = false,
}) => {
  return (
    <PlayerSelectPanel
      headerLabel="Who do you think is placing Boomi?"
      targets={targets}
      selectedTargetId={selectedTargetId}
      onSelectTarget={onSelectTarget}
      confirmLabel="Confirm guess"
      onConfirm={onConfirm}
      confirmDisabled={disabled || !selectedTargetId}
      secondaryLabel="Cancel"
      onSecondary={onCancel}
      disabled={disabled}
    />
  );
};
