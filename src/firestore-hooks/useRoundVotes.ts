import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export interface RoundVote {
  id: string;
  voterId: string;
  targetPlayerId: string;
  roleAtTime: "imposter" | "civilian";
}

interface UseRoundVotesResult {
  votes: RoundVote[];
  error: string | null;
}

export function useRoundVotes(
  roomId: string | null,
  round: number | null
): UseRoundVotesResult {
  const [votes, setVotes] = useState<RoundVote[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId || round == null) return;

    const votesRef = collection(db, "rooms", roomId, "votes");
    const q = query(votesRef, where("round", "==", round));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: RoundVote[] = snap.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            voterId: data.voterId,
            targetPlayerId: data.targetPlayerId,
            roleAtTime: data.roleAtTime,
          };
        });

        setVotes(next);
        setError(null);
      },
      (err) => {
        console.error("useRoundVotes error:", err);
        setError(err.message);
      }
    );

    return () => unsub();
  }, [roomId, round]);

  if (!roomId || round == null) {
    return { votes: [], error: null };
  }

  return { votes, error };
}
