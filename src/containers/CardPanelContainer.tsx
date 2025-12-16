import React, { useMemo, useState } from "react";
import { CardPanel } from "../components/CardPanel/CardPanel";
import { PixelFrame } from "../layout/PixelFrame/PixelFrame";
import { activateBlockCard } from "../services/activateBlockCard";
import { playPassBoomiCard } from "../services/playPassBoomiCard";
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

  // --- Local state for Pass on card usage in this round ---
  const [passCardUsage, setPassCardUsage] = useState<{
    round: number | null;
    used: boolean;
  }>({ round: null, used: false });

  const [selectedPassTargetId, setSelectedPassTargetId] = useState<
    string | null
  >(null);

  const hasUsedPassCardThisRound =
    passCardUsage.used && passCardUsage.round === room.round;

  // --- Targets for Pass on (respects Block) ---
  const passTargets = useMemo(
    () =>
      players.filter((p) => {
        if (!currentPlayer) return false;
        if (p.alive === false) return false;
        if (p.id === currentPlayer.id) return false;

        // Block: player has activated Block for this round
        if (p.blockActiveRound != null && p.blockActiveRound === room.round) {
          return false;
        }

        return true;
      }),
    [players, currentPlayer, room.round]
  );

  // --- Permissions ---

  const canUsePassCard =
    isCurrentHolder &&
    isAlive &&
    !hasUsedPassCardThisRound &&
    !room.passCardUsedThisRound &&
    passTargets.length > 0;

  const canUseBlockCard =
    !!currentPlayer &&
    isAlive &&
    !isCurrentHolder &&
    !currentPlayer.blockCardUsed &&
    room.status === "in_progress";

  // --- Handlers ---

  const handleConfirmPassTarget = async () => {
    if (
      !currentPlayer ||
      !isCurrentHolder ||
      !isAlive ||
      !selectedPassTargetId
    ) {
      return;
    }

    try {
      await playPassBoomiCard(roomId, selectedPassTargetId);

      setPassCardUsage({
        round: room.round,
        used: true,
      });
    } catch (err) {
      console.error("Failed to play Pass Boomi card", err);
    }

    setSelectedPassTargetId(null);
    onClose();
  };

  const handleUseBlockCard = async () => {
    if (!currentPlayer) return;
    if (!canUseBlockCard) return;

    try {
      await activateBlockCard(roomId, currentPlayer.id, room.round);
    } catch (err) {
      console.error("Failed to activate Block card", err);
    }

    onClose();
  };

  const handleSelectPassTarget = (id: string) => {
    setSelectedPassTargetId(id);
  };

  // --- Visibility rules ---
  if (!isOpen || isGuessOpen || !isAlive) {
    return null;
  }

  return (
    <PixelFrame>
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
    </PixelFrame>
  );
};
