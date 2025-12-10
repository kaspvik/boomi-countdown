import { doc, updateDoc } from "firebase/firestore";
import React, { useCallback, useEffect, useMemo } from "react";
import { db } from "../firebase";
import { startGame } from "../services/startGame";
import { useGameStore } from "../store/gameStore";
import type { Player } from "../types/game";

import { GameScreen } from "../components/GamePage/GameScreen";
import { LobbyScreen } from "../components/Lobbypage/LobbyScreen";
import lobbyStyles from "../components/Lobbypage/LobbyScreen.module.css";
import { QuestionScreen } from "../components/QuestionPage/QuestionScreen";
import { RoleScreen } from "../components/RolePage/RoleScreen";
import { GameLogo } from "../layout/GameLogo/GameLogo";

import { usePlayers } from "../firestore-hooks/usePlayers";
import { useRoom } from "../firestore-hooks/useRoom";

import { useRoundVotes } from "../firestore-hooks/useRoundVotes";

import { QuestionResultsScreen } from "../components/QuestionResultPage/QuestionResultsScreen";

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

  const { votes } = useRoundVotes(roomId, room?.round ?? null);

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

  const allAliveVoted =
    alivePlayers.length > 0 &&
    alivePlayers.every((p) => votes.some((v) => v.voterId === p.id));

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
    if (!isCurrentPlayerHost) return;

    const roomRef = doc(db, "rooms", roomId);

    try {
      await updateDoc(roomRef, {
        phase: "round",
      });
    } catch (err) {
      console.error("Failed to set phase=round", err);
    }
  }, [roomId, isCurrentPlayerHost]);

  useEffect(() => {
    if (
      !room ||
      room.phase !== "role_reveal" ||
      !gameStarted ||
      !allPlayersReady ||
      !isCurrentPlayerHost
    ) {
      return;
    }

    const roomRef = doc(db, "rooms", roomId);

    (async () => {
      try {
        await updateDoc(roomRef, {
          phase: "question",
        });
      } catch (err) {
        console.error("Failed to set phase=question", err);
      }
    })();
  }, [room, roomId, gameStarted, allPlayersReady, isCurrentPlayerHost]);

  // 🆕 När alla levande har röstat i QUESTION-fasen -> gå till QUESTION_RESULTS
  useEffect(() => {
    if (
      !room ||
      room.phase !== "question" ||
      !gameStarted ||
      !isCurrentPlayerHost ||
      !allAliveVoted
    ) {
      return;
    }

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

  // --- Loading / error-state ---

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

  // 2.5) QUESTION RESULTS
  if (gameStarted && room.phase === "question_results" && currentPlayer) {
    return (
      <QuestionResultsScreen
        room={room}
        roomId={roomId}
        players={players}
        isHost={isCurrentPlayerHost}
        onLeave={onLeave}
        onContinue={handleHostStartRound} //
      />
    );
  }

  // 3) MAIN ROUND / GAME
  if (gameStarted && room.phase === "round" && currentPlayer) {
    return (
      <GameScreen
        room={room}
        roomId={roomId}
        players={players}
        currentPlayer={currentPlayer}
        onLeave={onLeave}
      />
    );
  }

  // 4) Annars: lobby
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
