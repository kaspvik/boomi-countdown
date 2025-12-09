import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function passBomb(
  roomId: string,
  toPlayerId: string
): Promise<void> {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    currentBombHolder: toPlayerId,
  });
}
