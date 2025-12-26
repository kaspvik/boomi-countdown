import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

export async function submitVote(params: {
  roomId: string;
  round: number;
  voterId: string;
  targetPlayerId: string;
  roleAtTime: "imposter" | "civilian";
}): Promise<void> {
  const { roomId, round, voterId, targetPlayerId, roleAtTime } = params;

  const voterRef = doc(db, "rooms", roomId, "players", voterId);

  const voteRef = doc(db, "rooms", roomId, "roundVotes", `${round}_${voterId}`);

  await runTransaction(db, async (tx) => {
    const voterSnap = await tx.get(voterRef);
    if (!voterSnap.exists()) throw new Error("Voter not found");

    const voterData = voterSnap.data() as { alive?: boolean };
    if (voterData.alive === false) {
      throw new Error("Eliminated players cannot vote");
    }

    const existingVoteSnap = await tx.get(voteRef);
    if (existingVoteSnap.exists()) {
      throw new Error("Already voted this round");
    }

    tx.set(voteRef, {
      roomId,
      round,
      voterId,
      targetPlayerId,
      roleAtTime,
      createdAt: serverTimestamp(),
    });
  });
}
