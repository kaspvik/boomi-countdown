import { doc, increment, updateDoc } from "firebase/firestore";
import { useCallback, useEffect, useMemo } from "react";
import { GameOverScreen } from "../components/GameOverPage/GameOverScreen";
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
import { getWinningTeam } from "../services/winConditions";
import { useGameStore } from "../store/gameStore";
import type { Player } from "../types/game";
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

  useEffect(() => {
    if (!room) return;
    if (!gameStarted) return;
    if (!isCurrentPlayerHost) return;

    if (
      room.phase === "question_results" &&
      room.round > 1 &&
      votes.length === 0
    ) {
      console.warn(
        "[RoomScreenContainer] No votes for this round, but in question_results. Sending back to question."
      );
      const roomRef = doc(db, "rooms", roomId);
      (async () => {
        try {
          await updateDoc(roomRef, { phase: "question" });
        } catch (err) {
          console.error("Failed to reset phase to question", err);
        }
      })();
    }
  }, [room, roomId, gameStarted, isCurrentPlayerHost, votes.length]);

  useRoomPhaseTransitions(
    room ?? null,
    roomId,
    gameStarted,
    allPlayersReady,
    isCurrentPlayerHost
  );

  const allAliveVoted =
    room?.phase === "question" &&
    alivePlayers.length > 0 &&
    votes.length > 0 &&
    alivePlayers.every((p) => votes.some((v) => v.voterId === p.id));

  useEffect(() => {
    if (
      !room ||
      !gameStarted ||
      !isCurrentPlayerHost ||
      room.phase !== "question"
    ) {
      return;
    }

    if (!allAliveVoted) return;

    const roomRef = doc(db, "rooms", roomId);

    (async () => {
      try {
        await updateDoc(roomRef, {
          phase: "question_results",
        });
      } catch (err) {
        console.error("Failed to set phase=question_results", err);
      }
    })();
  }, [room, roomId, gameStarted, isCurrentPlayerHost, allAliveVoted]);

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

  const handleHostStartNextRound = useCallback(async () => {
    if (!isCurrentPlayerHost || !room) return;

    const roomRef = doc(db, "rooms", roomId);
    const winner = getWinningTeam(players);

    try {
      if (winner) {
        await updateDoc(roomRef, {
          status: "finished",
          phase: "game_over",
          winner,
          lastKilledPlayerId: room.lastKilledPlayerId ?? null,
          roundResultsStep: null,
        });
      } else {
        await updateDoc(roomRef, {
          round: increment(1), // 🔥 alltid +1 i databasen
          phase: "question",
          lastKilledPlayerId: null,
          roundResultsStep: null,
          passCardUsedThisRound: false,
          roundTimePenaltySeconds: 0,
        });
      }
    } catch (err) {
      console.error("Failed to start next round / finish game", err);
    }
  }, [roomId, isCurrentPlayerHost, room, players]);

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

  // 5) GAME RESULTS
  if (gameStarted && room.phase === "round_results" && currentPlayer) {
    return (
      <RoundResultsContainer
        room={room}
        players={players}
        currentPlayer={currentPlayer}
        isHost={isCurrentPlayerHost}
        onLeave={onLeave}
        onNext={handleHostStartNextRound}
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
        onLeave={onLeave}
      />
    );
  }

  // 7) Annars: lobby
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
