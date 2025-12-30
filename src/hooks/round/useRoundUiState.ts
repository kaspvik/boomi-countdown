import { useCallback, useMemo, useState } from "react";
import { resolveGuess } from "../../services";
import type { Player } from "../../types/game";

interface UseRoundUiStateParams {
  roomId: string;
  players: Player[];
  currentPlayer: Player | null;
  isAlive: boolean;
  isCurrentHolder: boolean;
}

export function useRoundUiState({
  roomId,
  players,
  currentPlayer,
  isAlive,
  isCurrentHolder,
}: UseRoundUiStateParams) {
  const [isPassPanelOpen, setIsPassPanelOpen] = useState(false);

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

  const openPassPanel = useCallback(() => {
    if (!isAlive) return;
    if (isGuessOpen) return;
    setIsPassPanelOpen(true);
  }, [isAlive, isGuessOpen]);

  const closePassPanel = useCallback(() => {
    setIsPassPanelOpen(false);
  }, []);

  return {
    // Guess
    isGuessOpen,
    guessTargets,
    selectedGuessTargetId,
    setSelectedGuessTargetId,
    openGuess,
    cancelGuess,
    confirmGuess,

    // Pass panel
    isPassPanelOpen,
    openPassPanel,
    closePassPanel,
  };
}
