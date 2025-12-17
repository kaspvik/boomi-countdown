import React, { useMemo, useState } from "react";
import { CardPanel } from "../components/CardPanel/CardPanel";
import { activateBlockCard } from "../services/activateBlockCard";
import { passBomb } from "../services/passBomb";
import type { Player, Room } from "../types/game";

interface CardPanelContainerProps {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
  roomId: string;

  isOpen: boolean;
  isGuessOpen: boolean;
  onClose: () => void;
}

export const CardPanelContainer: React.FC<CardPanelContainerProps> = ({
  room,
  players,
  currentPlayer,
  roomId,
  isOpen,
  isGuessOpen,
  onClose,
}) => {
  const isCurrentHolder =
    currentPlayer != null && currentPlayer.id === room.currentBombHolder;

  const isAlive = currentPlayer?.alive ?? true;

  const [selectedPassTargetId, setSelectedPassTargetId] = useState<
    string | null
  >(null);

  const hasUsedPassThisRound =
    currentPlayer?.passUsedRound != null &&
    currentPlayer.passUsedRound === room.round;

  const passTargets = useMemo(
    () =>
      players.filter((p) => {
        if (!currentPlayer) return false;
        if (p.alive === false) return false;
        if (p.id === currentPlayer.id) return false;

        if (p.blockActiveRound != null && p.blockActiveRound === room.round) {
          return false;
        }

        return true;
      }),
    [players, currentPlayer, room.round]
  );

  const canUsePassCard =
    isCurrentHolder &&
    isAlive &&
    !hasUsedPassThisRound &&
    !room.passCardUsedThisRound &&
    passTargets.length > 0 &&
    room.status === "in_progress";

  const canUseBlockCard =
    !!currentPlayer &&
    isAlive &&
    !isCurrentHolder &&
    !currentPlayer.blockCardUsed &&
    room.status === "in_progress";

  const handleConfirmPassTarget = async () => {
    if (!currentPlayer) return;
    if (!isCurrentHolder) return;
    if (!isAlive) return;
    if (!selectedPassTargetId) return;
    if (!canUsePassCard) return;

    try {
      await passBomb(roomId, currentPlayer.id, selectedPassTargetId, "card");
    } catch (err) {
      console.error("Failed to pass bomb", err);
    } finally {
      setSelectedPassTargetId(null);
      onClose();
    }
  };

  const handleUseBlockCard = async () => {
    if (!currentPlayer) return;
    if (!canUseBlockCard) return;

    try {
      await activateBlockCard(roomId, currentPlayer.id, room.round);
    } catch (err) {
      console.error("Failed to activate Block card", err);
    } finally {
      onClose();
    }
  };

  const handleSelectPassTarget = (id: string) => {
    setSelectedPassTargetId(id);
  };

  if (!isOpen || isGuessOpen || !isAlive) {
    return null;
  }

  return (
    <CardPanel
      targets={passTargets}
      selectedTargetId={selectedPassTargetId}
      onSelectTarget={handleSelectPassTarget}
      onConfirm={handleConfirmPassTarget}
      onCancel={onClose}
      canUsePassCard={canUsePassCard}
      canUseBlockCard={canUseBlockCard}
      onUseBlockCard={handleUseBlockCard}
    />
  );
};
