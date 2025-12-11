import { useCallback, useMemo, useState } from "react";
import { GameScreen } from "../components/GamePage/GameScreen";
import { killPlayer } from "../services/killPlayer";
import type { Player, Room } from "../types/game";

interface GameScreenContainerProps {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
  roomId: string;
  onLeave: () => void;
}

export const GameScreenContainer: React.FC<GameScreenContainerProps> = ({
  room,
  players,
  currentPlayer,
  roomId,
  onLeave,
}) => {
  const bombHolder =
    players.find((p) => p.id === room.currentBombHolder) || null;

  const isCurrentHolder =
    currentPlayer != null && currentPlayer.id === room.currentBombHolder;
  const isAlive = currentPlayer?.alive ?? true;

  const [isGuessOpen, setIsGuessOpen] = useState(false);
  const [selectedGuessTargetId, setSelectedGuessTargetId] = useState<
    string | null
  >(null);

  const guessTargets = useMemo(
    () =>
      players.filter(
        (p) => p.alive !== false && currentPlayer && p.id !== currentPlayer.id
      ),
    [players, currentPlayer]
  );

  const handleTimerTimeout = useCallback(() => {
    if (!currentPlayer || !isCurrentHolder || !isAlive) return;

    (async () => {
      try {
        await killPlayer(roomId, currentPlayer.id);
      } catch (err) {
        console.error("Failed to kill player on timeout", err);
      }
    })();
  }, [currentPlayer, isCurrentHolder, isAlive, roomId]);

  const timerKey = `${room.round}-${room.currentBombHolder ?? "none"}`;

  const handleOpenGuess = () => {
    if (!isCurrentHolder || !isAlive) return;
    setIsGuessOpen(true);
    setSelectedGuessTargetId(null);
  };

  const handleCancelGuess = () => {
    setIsGuessOpen(false);
    setSelectedGuessTargetId(null);
  };

  const handleConfirmGuess = () => {
    if (!isCurrentHolder || !isAlive || !selectedGuessTargetId) return;

    setIsGuessOpen(false);
    setSelectedGuessTargetId(null);
  };

  return (
    <GameScreen
      timerKey={timerKey}
      durationSeconds={10000}
      onTimeout={handleTimerTimeout}
      onLeave={onLeave}
      showInfoBox={!isCurrentHolder && isAlive && !!bombHolder}
      bombHolderName={bombHolder?.name ?? null}
      isCurrentHolder={isCurrentHolder}
      isAlive={isAlive}
      isGuessOpen={isGuessOpen}
      guessTargets={guessTargets}
      selectedGuessTargetId={selectedGuessTargetId}
      onSelectGuessTarget={setSelectedGuessTargetId}
      onOpenGuess={handleOpenGuess}
      onCancelGuess={handleCancelGuess}
      onConfirmGuess={handleConfirmGuess}
    />
  );
};
