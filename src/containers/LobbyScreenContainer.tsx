import React, { useCallback } from "react";
import { LobbyScreen } from "../components/LobbyScreen";
import { usePlayers, useRoom } from "../hooks";
import { startGame } from "../services/rooms";
import type { Player } from "../types/game";

interface LobbyScreenContainerProps {
  roomId: string;
  currentPlayerId: string | null;
  onLeave: () => void;
}

export const LobbyScreenContainer: React.FC<LobbyScreenContainerProps> = ({
  roomId,
  currentPlayerId,
  onLeave,
}) => {
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId);
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers(roomId);

  const currentPlayer: Player | null =
    players.find((p) => p.id === currentPlayerId) ?? null;

  const isCurrentPlayerHost = currentPlayer?.isHost ?? false;
  const gameStarted = room?.status === "in_progress";

  const handleStartGame = useCallback(async () => {
    if (!isCurrentPlayerHost || !currentPlayerId) return;

    try {
      await startGame(roomId, currentPlayerId);
    } catch (err) {
      console.error("Failed to start game", err);
    }
  }, [roomId, currentPlayerId, isCurrentPlayerHost]);

  return (
    <LobbyScreen
      room={room}
      roomLoading={roomLoading}
      roomError={roomError}
      players={players}
      playersLoading={playersLoading}
      playersError={playersError}
      onLeave={onLeave}
      onStartGame={handleStartGame}
      canStartGame={isCurrentPlayerHost && room?.status === "lobby"}
      gameStarted={gameStarted}
      currentPlayer={currentPlayer}
    />
  );
};
