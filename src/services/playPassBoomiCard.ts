import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

// Pass Boomi card: pass the bomb AND shorten the round by 5 seconds.
export async function playPassBoomiCard(
  roomId: string,
  toPlayerId: string
): Promise<void> {
  const roomRef = doc(db, "rooms", roomId);

  await updateDoc(roomRef, {
    currentBombHolder: toPlayerId,
    passCardUsedThisRound: true,
    // Lägg på 5 sek tidsstraff. Om fältet inte finns blir det 5.
    roundTimePenaltySeconds: increment(5),
  });
}
