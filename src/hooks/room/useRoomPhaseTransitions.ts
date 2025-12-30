import { doc, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../firebase";
import type { Room } from "../types/game";

export function useRoomPhaseTransitions(
  room: Room | null,
  roomId: string,
  gameStarted: boolean,
  allPlayersReady: boolean,
  isCurrentPlayerHost: boolean
) {
  useEffect(() => {
    if (
      !room ||
      !gameStarted ||
      !isCurrentPlayerHost ||
      room.phase !== "role_reveal"
    ) {
      return;
    }

    if (!allPlayersReady) return;

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
}
