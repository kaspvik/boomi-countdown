// services/rooms/leaveRoom.ts
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ensureSignedIn } from "../auth/authService";

type PlayerDoc = {
  authUid: string | null;
  alive?: boolean;
};

export async function leaveRoom(roomId: string, playerId: string) {
  const user = await ensureSignedIn();

  const roomRef = doc(db, "rooms", roomId);
  const playerRef = doc(db, "rooms", roomId, "players", playerId);
  const playersCol = collection(db, "rooms", roomId, "players");

  await runTransaction(db, async (tx) => {
    const roomSnap = await tx.get(roomRef);
    if (!roomSnap.exists()) return;

    const room = roomSnap.data() as {
      currentBombHolder?: string | null;
    };

    const playerSnap = await tx.get(playerRef);
    if (!playerSnap.exists()) return;

    const player = playerSnap.data() as { authUid: string | null };
    if (!player.authUid || player.authUid !== user.uid) {
      throw new Error("Not allowed to delete this player.");
    }

    const playersSnap = await getDocs(query(playersCol));
    const remainingPlayers = playersSnap.docs
      .filter((d) => d.id !== playerId)
      .map((d) => ({ id: d.id, ...(d.data() as PlayerDoc) }));

    tx.delete(playerRef);

    const leavingWasHolder = room.currentBombHolder === playerId;
    if (leavingWasHolder) {
      const next = remainingPlayers[0]?.id ?? null;
      tx.update(roomRef, { currentBombHolder: next });
    }

    if (remainingPlayers.length === 0) {
      tx.delete(roomRef);
    }
  });
}
