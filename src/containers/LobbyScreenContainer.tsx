import React, { useCallback } from "react";
import { LobbyScreen } from "../components/LobbyScreen";
import { usePlayers, useRoom } from "../hooks";
import { startGame } from "../services/rooms";

interface LobbyScreenContainerProps {
  roomId: string;
  onLeave: () => void;
}

export const LobbyScreenContainer: React.FC<LobbyScreenContainerProps> = ({
  roomId,
  onLeave,
}) => {
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId);
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers(roomId);

  const handleStartGame = useCallback(async () => {
    try {
      await startGame(roomId);
    } catch (err) {
      console.error("Failed to start game", err);
    }
  }, [roomId]);

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
    />
  );
};
