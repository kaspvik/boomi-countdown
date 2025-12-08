import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import type { Role } from "../../types/game";

function getImposterCount(playerCount: number): number {
  if (playerCount <= 6) return 1;
  if (playerCount <= 9) return 2;
  return 3;
}

export async function startGame(
  roomId: string,
  currentPlayerId: string
): Promise<void> {
  const playerRef = doc(db, "rooms", roomId, "players", currentPlayerId);
  const playerSnap = await getDoc(playerRef);

  if (!playerSnap.exists()) {
    throw new Error("Player not found.");
  }

  const playerData = playerSnap.data();
  if (!playerData.isHost) {
    throw new Error("Only the host can start the game.");
  }

  const playersCol = collection(db, "rooms", roomId, "players");
  const snapshot = await getDocs(playersCol);

  const players = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  if (players.length < 2) {
    throw new Error("Need at least 2 players to start the game.");
  }

  const imposterCount = Math.min(
    getImposterCount(players.length),
    players.length - 1
  );

  const shuffled = [...players].sort(() => Math.random() - 0.5);
  const imposterIds = new Set(
    shuffled.slice(0, imposterCount).map((p) => p.id)
  );

  const updates: Promise<void>[] = [];

  for (const player of players) {
    const role: Role = imposterIds.has(player.id) ? "imposter" : "civilian";

    const pRef = doc(db, "rooms", roomId, "players", player.id);
    updates.push(
      updateDoc(pRef, {
        role,
        alive: true,
        hasAcknowledgedRole: false,
      })
    );
  }

  const randomBombHolder =
    players[Math.floor(Math.random() * players.length)].id;

  const roomRef = doc(db, "rooms", roomId);
  updates.push(
    updateDoc(roomRef, {
      status: "in_progress",
      round: 1,
      currentBombHolder: randomBombHolder,
      phase: "role_reveal",
    })
  );

  await Promise.all(updates);
}
