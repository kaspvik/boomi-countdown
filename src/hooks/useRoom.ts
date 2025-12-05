import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import type { Room } from "../types/game";

interface UseRoomResult {
  room: Room | null;
  loading: boolean;
  error: string | null;
}

export function useRoom(roomId: string | null): UseRoomResult {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) {
      return;
    }

    const roomRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setRoom(null);
          setError("Room not found (Maybe it was deleted?)");
          setLoading(false);
          return;
        }

        const data = snapshot.data();

        setRoom({
          id: snapshot.id,
          code: data.code,
          status: data.status,
          createdAt: data.createdAt ?? null,
          round: data.round,
          currentBombHolder: data.currentBombHolder ?? null,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error("useRoom error:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [roomId]);

  if (!roomId) {
    return {
      room: null,
      loading: false,
      error: null,
    };
  }

  return { room, loading, error };
}
