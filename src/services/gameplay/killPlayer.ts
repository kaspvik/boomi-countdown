import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function killPlayer(
  roomId: string,
  playerId: string
): Promise<void> {
  const playerRef = doc(db, "rooms", roomId, "players", playerId);
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(playerRef, {
    alive: false,
  });

  await updateDoc(roomRef, {
    lastKilledPlayerId: playerId,
    currentBombHolder: null,
    phase: "round_results",
    roundResultsStep: "explosion",
  });
}
