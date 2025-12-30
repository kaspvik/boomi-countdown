import { useMemo } from "react";
import type { Player, Room } from "../../types/game";

type Vote = { voterId: string };

export function useRoomDerivedState(params: {
  room: Room | null;
  players: Player[];
  currentPlayerId: string | null;
  votes: Vote[];
}) {
  const { room, players, currentPlayerId, votes } = params;

  const currentPlayer = useMemo(
    () => players.find((p) => p.id === currentPlayerId) ?? null,
    [players, currentPlayerId]
  );

  const isCurrentPlayerHost = currentPlayer?.isHost ?? false;
  const gameStarted = room?.status === "in_progress";

  const alivePlayers = useMemo(
    () => players.filter((p) => p.alive !== false),
    [players]
  );

  const allPlayersReady = useMemo(
    () =>
      alivePlayers.length > 0 &&
      alivePlayers.every((p) => p.hasAcknowledgedRole),
    [alivePlayers]
  );

  const allAliveVoted = useMemo(() => {
    if (room?.phase !== "question") return false;
    if (alivePlayers.length === 0) return false;
    if (votes.length === 0) return false;

    return alivePlayers.every((p) => votes.some((v) => v.voterId === p.id));
  }, [room?.phase, alivePlayers, votes]);

  return {
    currentPlayer,
    isCurrentPlayerHost,
    gameStarted,
    alivePlayers,
    allPlayersReady,
    allAliveVoted,
  };
}
