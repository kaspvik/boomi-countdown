import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";

export async function submitVote(
  roomId: string,
  voterId: string,
  targetPlayerId: string,
  roleAtTime: "imposter" | "civilian"
): Promise<void> {
  const roomRef = doc(db, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    throw new Error(`Room ${roomId} not found when submitting vote`);
  }

  const roomData = roomSnap.data();
  const currentRound: number = roomData.round ?? 1;

  console.log(
    `[submitVote] room=${roomId} round=${currentRound} voter=${voterId} target=${targetPlayerId} role=${roleAtTime}`
  );

  const votesRef = collection(db, "rooms", roomId, "roundVotes");

  await addDoc(votesRef, {
    roomId,
    round: currentRound,
    voterId,
    targetPlayerId,
    roleAtTime,
    createdAt: serverTimestamp(),
  });
}
