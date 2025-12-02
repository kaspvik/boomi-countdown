import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import type { Room } from "../../types/game";

export async function createRoom(code: string): Promise<Room> {
  const roomsRef = collection(db, "rooms");

  const docRef = await addDoc(roomsRef, {
    code,
    status: "lobby",
    round: 0,
    currentBombHolder: null,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    code,
    status: "lobby",
    round: 0,
    currentBombHolder: null,
    createdAt: null,
  };
}
