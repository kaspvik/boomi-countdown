import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export async function startRoomTimer(roomId: string) {
  const roomRef = doc(db, "rooms", roomId);
  await updateDoc(roomRef, {
    timerStartedAt: serverTimestamp(),
    roundTimePenaltySeconds: 0,
  });
}
