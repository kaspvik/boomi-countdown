import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import type { Player } from "../types/game";

interface UsePlayersResult {
  players: Player[];
  loading: boolean;
  error: string | null;
}

export function usePlayers(roomId: string | null): UsePlayersResult {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const playersRef = collection(db, "rooms", roomId, "players");
    const q = query(playersRef, orderBy("joinedAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextPlayers: Player[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
            name: data.name,
            role: data.role ?? null,
            isHost: data.isHost ?? false,
            alive: data.alive ?? true,
            joinedAt: data.joinedAt ?? null,
          };
        });

        setPlayers(nextPlayers);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("usePlayers error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  if (!roomId) {
    return {
      players: [],
      loading: false,
      error: null,
    };
  }

  return { players, loading, error };
}
