import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import type { Room } from "../../types/game";
import { ensureSignedIn } from "../auth/authService";

export async function createRoom(code: string): Promise<Room> {
  const user = await ensureSignedIn();

  const roomsRef = collection(db, "rooms");

  const docRef = await addDoc(roomsRef, {
    code,
    status: "lobby",
    round: 0,
    currentBombHolder: null,
    phase: null,
    createdAt: serverTimestamp(),
    hostAuthUid: user.uid,
    lastKilledPlayerId: null,
    roundResultsStep: null,
    winner: null,
    passCardUsedThisRound: false,
    roundTimePenaltySeconds: 0,
  });

  return {
    id: docRef.id,
    code,
    status: "lobby",
    round: 0,
    currentBombHolder: null,
    createdAt: null,
    phase: null,
    hostAuthUid: user.uid,
    lastKilledPlayerId: null,
    roundResultsStep: null,
    winner: null,
    passCardUsedThisRound: false,
    roundTimePenaltySeconds: 0,
  };
}
