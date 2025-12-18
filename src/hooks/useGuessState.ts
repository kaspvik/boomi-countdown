import { useCallback, useMemo, useState } from "react";
import { resolveGuess } from "../services";
import type { Player } from "../types/game";

interface UseGuessStateParams {
  roomId: string;
  players: Player[];
  currentPlayer: Player | null;
  isAlive: boolean;
  isCurrentHolder: boolean;
  isPassPanelOpen: boolean;
}

export function useGuessState({
  roomId,
  players,
  currentPlayer,
  isAlive,
  isCurrentHolder,
  isPassPanelOpen,
}: UseGuessStateParams) {
  const [isGuessOpen, setIsGuessOpen] = useState(false);
  const [selectedGuessTargetId, setSelectedGuessTargetId] = useState<
    string | null
  >(null);

  const guessTargets = useMemo(() => {
    if (!currentPlayer) return [];
    return players.filter(
      (p) => p.alive !== false && p.id !== currentPlayer.id
    );
  }, [players, currentPlayer]);

  const resetGuess = useCallback(() => {
    setIsGuessOpen(false);
    setSelectedGuessTargetId(null);
  }, []);

  const openGuess = useCallback(() => {
    if (!isCurrentHolder || !isAlive || isPassPanelOpen) return;
    setIsGuessOpen(true);
    setSelectedGuessTargetId(null);
  }, [isCurrentHolder, isAlive, isPassPanelOpen]);

  const cancelGuess = useCallback(() => {
    resetGuess();
  }, [resetGuess]);

  const confirmGuess = useCallback(async () => {
    if (
      !currentPlayer ||
      !isCurrentHolder ||
      !isAlive ||
      !selectedGuessTargetId
    )
      return;

    try {
      await resolveGuess(roomId, currentPlayer.id, selectedGuessTargetId);
    } catch (err) {
      console.error("Failed to resolve guess", err);
    } finally {
      resetGuess();
    }
  }, [
    roomId,
    currentPlayer,
    isCurrentHolder,
    isAlive,
    selectedGuessTargetId,
    resetGuess,
  ]);

  return {
    isGuessOpen,
    selectedGuessTargetId,
    guessTargets,

    setSelectedGuessTargetId,
    openGuess,
    cancelGuess,
    confirmGuess,
  };
}
