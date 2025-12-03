import { useCallback } from "react";
import { LobbyScreen } from "../components/LobbyScreen";
import { usePlayers, useRoom } from "../hooks";
import { startGame } from "../services/rooms";

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

  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const isCurrentPlayerHost = currentPlayer?.isHost ?? false;

  const handleStartGame = useCallback(async () => {
    if (!currentPlayerId) return;

    try {
      await startGame(roomId, currentPlayerId);
    } catch (err) {
      console.error("Failed to start game", err);
    }
  }, [roomId, currentPlayerId]);

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
    />
  );
};
