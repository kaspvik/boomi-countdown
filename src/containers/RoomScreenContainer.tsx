import { doc, updateDoc } from "firebase/firestore";
import { useCallback, useMemo } from "react";
import { LobbyScreen } from "../components/Lobbypage/LobbyScreen";
import lobbyStyles from "../components/Lobbypage/LobbyScreen.module.css";
import { QuestionScreen } from "../components/QuestionPage/QuestionScreen";
import { RoleScreen } from "../components/RolePage/RoleScreen";
import { db } from "../firebase";
import { usePlayers } from "../firestore-hooks/usePlayers";
import { useRoom } from "../firestore-hooks/useRoom";
import { useRoomPhaseTransitions } from "../firestore-hooks/useRoomPhaseTransitions";
import { useRoundVotes } from "../firestore-hooks/useRoundVotes";
import { GameLogo } from "../layout/GameLogo/GameLogo";
import { startGame } from "../services/startGame";
import { getTopVotedPlayerForRole } from "../services/voteHelpers";
import { useGameStore } from "../store/gameStore";
import type { Player } from "../types/game";
import { GameScreenContainer } from "./GameScreenContainer";
import { QuestionResultsContainer } from "./QuestionResultsContainer";

interface RoomScreenContainerProps {
  roomId: string;
  onLeave: () => void;
}

export const RoomScreenContainer: React.FC<RoomScreenContainerProps> = ({
  roomId,
  onLeave,
}) => {
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId);
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers(roomId);

  const currentPlayerId = useGameStore((s) => s.currentPlayerId);

  const currentPlayer: Player | null = useMemo(
    () => players.find((p) => p.id === currentPlayerId) ?? null,
    [players, currentPlayerId]
  );

  const isCurrentPlayerHost = currentPlayer?.isHost ?? false;
  const gameStarted = room?.status === "in_progress";

  const alivePlayers = players.filter((p) => p.alive !== false);

  const allPlayersReady =
    alivePlayers.length > 0 && alivePlayers.every((p) => p.hasAcknowledgedRole);

  const { votes } = useRoundVotes(roomId, room?.round ?? null);

  useRoomPhaseTransitions(
    room ?? null,
    roomId,
    gameStarted,
    alivePlayers,
    allPlayersReady,
    isCurrentPlayerHost
  );

  const handleStartGame = useCallback(async () => {
    if (!isCurrentPlayerHost || !currentPlayerId) return;

    try {
      await startGame(roomId, currentPlayerId);
    } catch (err) {
      console.error("Failed to start game", err);
    }
  }, [roomId, currentPlayerId, isCurrentPlayerHost]);

  const handleAcknowledgeRole = useCallback(async () => {
    if (!currentPlayerId) return;

    const playerRef = doc(db, "rooms", roomId, "players", currentPlayerId);

    try {
      await updateDoc(playerRef, {
        hasAcknowledgedRole: true,
      });
    } catch (err) {
      console.error("Failed to acknowledge role", err);
    }
  }, [roomId, currentPlayerId]);

  const handleHostStartRound = useCallback(async () => {
    if (!isCurrentPlayerHost || !room) return;

    const roomRef = doc(db, "rooms", roomId);

    const { player: topImposterTarget } = getTopVotedPlayerForRole(
      votes,
      players,
      "imposter"
    );

    try {
      await updateDoc(roomRef, {
        phase: "round",
        currentBombHolder: topImposterTarget ? topImposterTarget.id : null,
      });
    } catch (err) {
      console.error("Failed to set phase=round + currentBombHolder", err);
    }
  }, [roomId, isCurrentPlayerHost, room, votes, players]);

  if (roomLoading || playersLoading) {
    return (
      <main className={lobbyStyles.main}>
        <p className="text-subtitle">Loading...</p>
      </main>
    );
  }

  if (roomError || playersError) {
    return (
      <main className={lobbyStyles.main}>
        <p style={{ color: "red" }}>
          {roomError || playersError || "Something went wrong."}
        </p>
      </main>
    );
  }

  if (!room) {
    return (
      <main className={lobbyStyles.main}>
        <p className="text-subtitle">Room not found.</p>
      </main>
    );
  }

  // 1) ROLE REVEAL
  if (gameStarted && room.phase === "role_reveal" && currentPlayer) {
    const role = currentPlayer.role ?? "civilian";
    const hasAcknowledged = !!currentPlayer.hasAcknowledgedRole;

    return (
      <main className={lobbyStyles.main}>
        <section className={lobbyStyles.frameSection}>
          <GameLogo />
          <RoleScreen
            role={role}
            hasAcknowledged={hasAcknowledged}
            allReady={allPlayersReady}
            onAcknowledge={handleAcknowledgeRole}
          />
        </section>
      </main>
    );
  }

  // 2) QUESTION PHASE
  if (gameStarted && room.phase === "question" && currentPlayer) {
    return (
      <QuestionScreen
        room={room}
        roomId={roomId}
        players={players}
        currentPlayer={currentPlayer}
        onLeave={onLeave}
        onHostStartRound={handleHostStartRound}
        isHost={isCurrentPlayerHost}
      />
    );
  }

  // 3) QUESTION RESULTS
  if (gameStarted && room.phase === "question_results" && currentPlayer) {
    return (
      <QuestionResultsContainer
        room={room}
        roomId={roomId}
        players={players}
        currentPlayer={currentPlayer}
        isHost={isCurrentPlayerHost}
        onLeave={onLeave}
        onContinue={handleHostStartRound}
      />
    );
  }

  // 4) MAIN ROUND / GAME
  if (gameStarted && room.phase === "round" && currentPlayer) {
    return (
      <GameScreenContainer
        room={room}
        roomId={roomId}
        players={players}
        currentPlayer={currentPlayer}
        onLeave={onLeave}
      />
    );
  }

  // 5) Annars: lobby
  return (
    <LobbyScreen
      room={room}
      players={players}
      playersLoading={playersLoading}
      playersError={playersError}
      onLeave={onLeave}
      onStartGame={handleStartGame}
      canStartGame={isCurrentPlayerHost && room.status === "lobby"}
    />
  );
};
