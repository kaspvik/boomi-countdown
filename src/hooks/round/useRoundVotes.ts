import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import type { RoundVote } from "../../types/game";

interface UseRoundVotesResult {
  votes: RoundVote[];
  error: string | null;
  loaded: boolean;
}

type FirestoreRoundVoteData = {
  voterId: string;
  targetPlayerId: string;
  roleAtTime?: "imposter" | "civilian" | null;
  round: number;
};

export function useRoundVotes(
  roomId: string | null,
  round: number | null
): UseRoundVotesResult {
  const [votes, setVotes] = useState<RoundVote[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastSnapKey, setLastSnapKey] = useState<string | null>(null);

  const isActive = !!roomId && round != null;

  const currentKey = useMemo(() => {
    if (!isActive) return null;
    return `${roomId}:${round}`;
  }, [isActive, roomId, round]);

  useEffect(() => {
    if (!isActive) return;

    const votesRef = collection(db, "rooms", roomId!, "roundVotes");
    const q = query(votesRef, where("round", "==", round));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: RoundVote[] = snap.docs.map((docSnap) => {
          const data = docSnap.data() as FirestoreRoundVoteData;

          return {
            id: docSnap.id,
            voterId: data.voterId,
            targetPlayerId: data.targetPlayerId,
            roleAtTime: data.roleAtTime ?? null,
            round: data.round,
          };
        });

        setVotes(next);
        setError(null);

        setLastSnapKey(`${roomId}:${round}`);
      },
      (err) => {
        console.error("useRoundVotes error:", err);
        setError(err.message);

        setLastSnapKey(`${roomId}:${round}`);
      }
    );

    return () => unsub();
  }, [isActive, roomId, round]);

  const loaded = isActive && currentKey != null && lastSnapKey === currentKey;

  if (!isActive) {
    return { votes: [], error: null, loaded: false };
  }

  return { votes, error, loaded };
}
