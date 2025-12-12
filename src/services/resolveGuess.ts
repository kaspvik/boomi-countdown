import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Player } from "../types/game";
import { killPlayer } from "./killPlayer";

export async function resolveGuess(
  roomId: string,
  guesserId: string,
  targetId: string
): Promise<void> {
  const playersRef = collection(db, "rooms", roomId, "players");
  const snapshot = await getDocs(playersRef);

  const players = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as Player[];

  const guesser = players.find((p) => p.id === guesserId);
  const target = players.find((p) => p.id === targetId);

  if (!guesser || !target) {
    throw new Error("Guesser or target player not found.");
  }

  if (target.role === "imposter") {
    await killPlayer(roomId, target.id);
  } else {
    await killPlayer(roomId, guesser.id);
  }

  const roomRef = doc(db, "rooms", roomId);
  await updateDoc(roomRef, {
    currentBombHolder: null,
  });
}
