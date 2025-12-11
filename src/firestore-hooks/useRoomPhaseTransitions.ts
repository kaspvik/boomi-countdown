import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../firebase";
import type { Player, Room } from "../types/game";

import { useRoundVotes } from "../firestore-hooks/useRoundVotes";

function useRoomPhaseTransitions(
  room: Room | null,
  roomId: string,
  gameStarted: boolean,
  alivePlayers: Player[],
  allPlayersReady: boolean,
  isCurrentPlayerHost: boolean
) {
  const { votes } = useRoundVotes(roomId, room?.round ?? null);

  const allAliveVoted =
    alivePlayers.length > 0 &&
    alivePlayers.every((p) => votes.some((v) => v.voterId === p.id));

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
}

export { useRoomPhaseTransitions };
