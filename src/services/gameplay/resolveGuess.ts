import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function resolveGuess(
  roomId: string,
  guesserId: string,
  targetId: string
): Promise<void> {
  const roomRef = doc(db, "rooms", roomId);
  const targetRef = doc(db, "rooms", roomId, "players", targetId);

  const snap = await getDoc(targetRef);
  const data = snap.data();

  const rawRole: unknown =
    data && typeof data === "object" && "role" in data
      ? (data as Record<string, unknown>).role
      : null;

  const isCorrect = rawRole === "imposter";

  if (isCorrect) {
    await updateDoc(roomRef, {
      currentBombHolder: targetId,
      lastKilledPlayerId: targetId,
      roundResultsStep: null,
    });

    await sleep(250);

    await updateDoc(roomRef, {
      roundResultsStep: "explosion",
    });

    return;
  }

  await updateDoc(roomRef, {
    currentBombHolder: guesserId,
    lastKilledPlayerId: guesserId,
    roundResultsStep: "explosion",
  });
}
