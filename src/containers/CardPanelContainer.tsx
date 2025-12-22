import React from "react";
import { CardPanel } from "../components/CardPanel/CardPanel";
import { useCardPanelState } from "../hooks/useCardPanelState";
import type { Player, Room } from "../types/game";

interface CardPanelContainerProps {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
  roomId: string;

  isOpen: boolean;
  isGuessOpen: boolean;
  onClose: () => void;

  requestBoomiExit: (afterExit: () => void) => void;
}

export const CardPanelContainer: React.FC<CardPanelContainerProps> = ({
  room,
  players,
  currentPlayer,
  roomId,
  isOpen,
  isGuessOpen,
  onClose,
  requestBoomiExit,
}) => {
  const ui = useCardPanelState({
    room,
    players,
    currentPlayer,
    roomId,
    onClose,
  });

  if (!isOpen || isGuessOpen || !ui.isAlive) {
    return null;
  }

  return (
    <CardPanel
      targets={ui.passTargets}
      selectedTargetId={ui.selectedPassTargetId}
      onSelectTarget={ui.selectPassTarget}
      onConfirm={ui.confirmPassTarget}
      onCancel={onClose}
      canUsePassCard={ui.canUsePassCard}
      canUseBlockCard={ui.canUseBlockCard}
      onUseBlockCard={ui.useBlockCard}
      requestBoomiExit={requestBoomiExit}
    />
  );
};
