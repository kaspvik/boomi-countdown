import { doc, increment, serverTimestamp, updateDoc } from "firebase/firestore";
import { useCallback } from "react";
import { db } from "../../firebase";
import {
  getTopVotedPlayerForRole,
  getWinningTeam,
  startGame,
} from "../../services";
import type { Player, Room } from "../../types/game";

type Vote = Parameters<typeof getTopVotedPlayerForRole>[0][number];

export function useRoomActions(params: {
  roomId: string;
  room: Room | null;
  players: Player[];
  votes: Vote[];
  currentPlayerId: string | null;
  isHost: boolean;
}) {
  const { roomId, room, players, votes, currentPlayerId, isHost } = params;

  const handleStartGame = useCallback(async () => {
    if (!isHost || !currentPlayerId) return;
    try {
      await startGame(roomId, currentPlayerId);
    } catch (err) {
      console.error("Failed to start game", err);
    }
  }, [roomId, currentPlayerId, isHost]);

  const handleAcknowledgeRole = useCallback(async () => {
    if (!currentPlayerId) return;

    const playerRef = doc(db, "rooms", roomId, "players", currentPlayerId);
    try {
      await updateDoc(playerRef, { hasAcknowledgedRole: true });
    } catch (err) {
      console.error("Failed to acknowledge role", err);
    }
  }, [roomId, currentPlayerId]);

  const handleHostStartRound = useCallback(async () => {
    if (!isHost || !room) return;

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

        // ✅ timer start (new round)
        timerStartedAt: serverTimestamp(),
        timerRound: room.round, // här är det samma round som redan gäller
        roundTimePenaltySeconds: 0,

        // (valfritt men ofta bra)
        roundResultsStep: null,
        lastKilledPlayerId: null,
      });
    } catch (err) {
      console.error("Failed to set phase=round + currentBombHolder", err);
    }
  }, [roomId, isHost, room, votes, players]);

  const handleHostStartNextRound = useCallback(async () => {
    if (!isHost || !room) return;

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

          // ✅ stop/clear timer
          timerStartedAt: null,
          timerRound: null,
        });
      } else {
        await updateDoc(roomRef, {
          round: increment(1),
          phase: "question",
          lastKilledPlayerId: null,
          roundResultsStep: null,
          passCardUsedThisRound: false,
          roundTimePenaltySeconds: 0,

          // ✅ clear timer so next round can't reuse it
          timerStartedAt: null,
          timerRound: null,
        });
      }
    } catch (err) {
      console.error("Failed to start next round / finish game", err);
    }
  }, [roomId, isHost, room, players]);

  return {
    handleStartGame,
    handleAcknowledgeRole,
    handleHostStartRound,
    handleHostStartNextRound,
  };
}
