import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function submitVote(
  roomId: string,
  round: number,
  voterId: string,
  targetPlayerId: string,
  roleAtTime: "imposter" | "civilian"
): Promise<void> {
  const votesRef = collection(db, "rooms", roomId, "votes");

  await addDoc(votesRef, {
    roomId,
    round,
    voterId,
    targetPlayerId,
    roleAtTime,
    createdAt: serverTimestamp(),
  });
}
