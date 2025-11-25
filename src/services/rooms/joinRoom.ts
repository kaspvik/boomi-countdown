import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import type { Player } from "../../types/game";

export async function joinRoom(roomId: string, name: string): Promise<Player> {
  const playersRef = collection(db, "rooms", roomId, "players");

  const docRef = await addDoc(playersRef, {
    name,
    role: null,
    isHost: false,
    joinedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    name,
    role: null,
    isHost: false,
    joinedAt: null,
  };
}
