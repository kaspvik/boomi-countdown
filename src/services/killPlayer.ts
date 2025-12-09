import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function killPlayer(
  roomId: string,
  playerId: string
): Promise<void> {
  const playerRef = doc(db, "rooms", roomId, "players", playerId);

  await updateDoc(playerRef, {
    alive: false,
  });
}
