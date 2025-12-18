import { useCallback, useMemo, useState } from "react";
import { activateBlockCard, passBomb } from "../services";
import type { Player, Room } from "../types/game";

export function useCardPanelState(params: {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
  roomId: string;
  onClose: () => void;
}) {
  const { room, players, currentPlayer, roomId, onClose } = params;

  const [selectedPassTargetId, setSelectedPassTargetId] = useState<
    string | null
  >(null);

  const isAlive = currentPlayer?.alive ?? true;
  const isCurrentHolder =
    !!currentPlayer && currentPlayer.id === room.currentBombHolder;

  const hasUsedPassThisRound =
    currentPlayer?.passUsedRound != null &&
    currentPlayer.passUsedRound === room.round;

  const passTargets = useMemo(() => {
    if (!currentPlayer) return [];

    return players.filter((p) => {
      if (p.alive === false) return false;
      if (p.id === currentPlayer.id) return false;

      if (p.blockActiveRound != null && p.blockActiveRound === room.round)
        return false;

      return true;
    });
  }, [players, currentPlayer, room.round]);

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

  const selectPassTarget = useCallback((id: string) => {
    setSelectedPassTargetId(id);
  }, []);

  const confirmPassTarget = useCallback(async () => {
    if (!currentPlayer) return;
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
  }, [roomId, currentPlayer, selectedPassTargetId, canUsePassCard, onClose]);

  const useBlockCard = useCallback(async () => {
    if (!currentPlayer) return;
    if (!canUseBlockCard) return;

    try {
      await activateBlockCard(roomId, currentPlayer.id, room.round);
    } catch (err) {
      console.error("Failed to activate Block card", err);
    } finally {
      onClose();
    }
  }, [roomId, currentPlayer, room.round, canUseBlockCard, onClose]);

  const resetSelection = useCallback(() => {
    setSelectedPassTargetId(null);
  }, []);

  return {
    isAlive,
    isCurrentHolder,
    passTargets,
    hasUsedPassThisRound,
    canUsePassCard,
    canUseBlockCard,

    selectedPassTargetId,

    selectPassTarget,
    confirmPassTarget,
    useBlockCard,
    resetSelection,
  };
}
