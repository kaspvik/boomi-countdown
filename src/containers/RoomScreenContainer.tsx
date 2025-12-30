import { useCallback, useState } from "react";
import { GameOverScreen } from "../components/GameOverPage/GameOverScreen";
import { LobbyScreen } from "../components/Lobbypage/LobbyScreen";
import lobbyStyles from "../components/Lobbypage/LobbyScreen.module.css";
import { QuestionScreen } from "../components/QuestionPage/QuestionScreen";
import { RoleScreen } from "../components/RolePage/RoleScreen";
import { useHostPhaseController } from "../hooks/useHostPhaseController";
import { usePlayers } from "../hooks/usePlayers";
import { useRoom } from "../hooks/useRoom";
import { useRoomActions } from "../hooks/useRoomActions";
import { useRoomDerivedState } from "../hooks/useRoomDerivedState";
import { useRoomPhaseTransitions } from "../hooks/useRoomPhaseTransitions";
import { useRoundVotes } from "../hooks/useRoundVotes";
import { GameLogo } from "../layout/GameLogo/GameLogo";
import { leaveRoom } from "../services/rooms/leaveRoom";
import { useGameStore } from "../store/gameStore";
import { GameScreenContainer } from "./GameScreenContainer";
import { QuestionResultsContainer } from "./QuestionResultsContainer";
import { RoundResultsContainer } from "./RoundResultsContainer";

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
  const { votes, loaded: votesLoaded } = useRoundVotes(
    roomId,
    room?.round ?? null
  );

  const derived = useRoomDerivedState({
    room,
    players,
    currentPlayerId,
    votes,
  });

  useRoomPhaseTransitions(
    room ?? null,
    roomId,
    derived.gameStarted,
    derived.allPlayersReady,
    derived.isCurrentPlayerHost
  );

  useHostPhaseController({
    room,
    roomId,
    gameStarted: derived.gameStarted,
    isHost: derived.isCurrentPlayerHost,
    allAliveVoted: derived.allAliveVoted,
    votesCount: votes.length,
    votesLoaded,
  });

  const actions = useRoomActions({
    roomId,
    room,
    players,
    votes,
    currentPlayerId,
    isHost: derived.isCurrentPlayerHost,
  });

  const currentPlayer = derived.currentPlayer ?? null;

  const [isLeaving, setIsLeaving] = useState(false);

  const handleLeaveGame = useCallback(async () => {
    if (isLeaving) return;

    setIsLeaving(true);
    try {
      if (currentPlayer) {
        await leaveRoom(roomId, currentPlayer.id);
      }
    } catch (err) {
      console.error("Failed to leave room:", err);
    } finally {
      setIsLeaving(false);
      onLeave();
    }
  }, [currentPlayer, isLeaving, onLeave, roomId]);

  // --- Loading / error ---
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
  if (derived.gameStarted && room.phase === "role_reveal" && currentPlayer) {
    const role = currentPlayer.role ?? "civilian";
    const hasAcknowledged = !!currentPlayer.hasAcknowledgedRole;

    const imposterTeammates =
      role === "imposter"
        ? players
            .filter((p) => p.role === "imposter" && p.id !== currentPlayer.id)
            .map((p) => p.name ?? "Unknown")
        : [];

    return (
      <main className={lobbyStyles.main}>
        <section className={lobbyStyles.frameSection}>
          <GameLogo />
          <RoleScreen
            role={role}
            hasAcknowledged={hasAcknowledged}
            allReady={derived.allPlayersReady}
            onAcknowledge={actions.handleAcknowledgeRole}
            imposterTeammates={imposterTeammates}
          />
        </section>
      </main>
    );
  }

  // 2) QUESTION
  if (derived.gameStarted && room.phase === "question" && currentPlayer) {
    return (
      <QuestionScreen
        room={room}
        roomId={roomId}
        round={room.round}
        players={players}
        currentPlayer={currentPlayer}
        onLeave={handleLeaveGame}
        onHostStartRound={actions.handleHostStartRound}
        isHost={derived.isCurrentPlayerHost}
      />
    );
  }

  // 3) QUESTION RESULTS
  if (
    derived.gameStarted &&
    room.phase === "question_results" &&
    currentPlayer
  ) {
    return (
      <QuestionResultsContainer
        room={room}
        roomId={roomId}
        players={players}
        currentPlayer={currentPlayer}
        isHost={derived.isCurrentPlayerHost}
        onLeave={handleLeaveGame}
        onContinue={actions.handleHostStartRound}
      />
    );
  }

  // 4) ROUND
  if (derived.gameStarted && room.phase === "round" && currentPlayer) {
    return (
      <GameScreenContainer
        room={room}
        roomId={roomId}
        players={players}
        currentPlayer={currentPlayer}
        onLeave={handleLeaveGame}
      />
    );
  }

  // 5) ROUND RESULTS
  if (derived.gameStarted && room.phase === "round_results" && currentPlayer) {
    return (
      <RoundResultsContainer
        room={room}
        players={players}
        currentPlayer={currentPlayer}
        isHost={derived.isCurrentPlayerHost}
        onNext={actions.handleHostStartNextRound}
      />
    );
  }

  // 6) GAME OVER
  if (
    room.status === "finished" &&
    room.phase === "game_over" &&
    currentPlayer
  ) {
    return (
      <GameOverScreen
        room={room}
        players={players}
        currentPlayer={currentPlayer}
        onLeave={handleLeaveGame}
      />
    );
  }

  // 7) LOBBY
  return (
    <LobbyScreen
      room={room}
      players={players}
      playersLoading={playersLoading}
      playersError={playersError}
      onLeave={handleLeaveGame}
      onStartGame={actions.handleStartGame}
      canStartGame={derived.isCurrentPlayerHost && room.status === "lobby"}
    />
  );
};
