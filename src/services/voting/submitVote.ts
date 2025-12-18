import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function submitVote(params: {
  roomId: string;
  round: number;
  voterId: string;
  targetPlayerId: string;
  roleAtTime: "imposter" | "civilian";
}): Promise<void> {
  const { roomId, round, voterId, targetPlayerId, roleAtTime } = params;

  const voteRef = doc(db, "rooms", roomId, "roundVotes", `${round}_${voterId}`);

  await setDoc(voteRef, {
    roomId,
    round,
    voterId,
    targetPlayerId,
    roleAtTime,
    createdAt: serverTimestamp(),
  });
}
