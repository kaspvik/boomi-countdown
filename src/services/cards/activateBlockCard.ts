import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function activateBlockCard(
  roomId: string,
  playerId: string,
  round: number
): Promise<void> {
  const playerRef = doc(db, "rooms", roomId, "players", playerId);

  await updateDoc(playerRef, {
    blockCardUsed: true,
    blockActiveRound: round,
  });
}
