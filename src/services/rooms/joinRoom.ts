import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import type { Player } from "../../types/game";

export async function joinRoom(
  roomId: string,
  name: string,
  isHost = false
): Promise<Player> {
  const playersCol = collection(db, "rooms", roomId, "players");

  const docRef = await addDoc(playersCol, {
    name,
    isHost,
    alive: true,
    role: null,
    joinedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    name,
    isHost,
    alive: true,
    role: null,
  };
}
