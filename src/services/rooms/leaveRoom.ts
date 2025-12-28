import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ensureSignedIn } from "../auth/authService";

type RemainingPlayerDoc = {
  authUid: string | null;
  alive?: boolean;
};

type LeavingPlayerDoc = {
  authUid: string | null;
  isHost: boolean;
};

type RoomDoc = {
  currentBombHolder?: string | null;
  hostAuthUid?: string | null;
};

export async function leaveRoom(roomId: string, playerId: string) {
  const user = await ensureSignedIn();

  const roomRef = doc(db, "rooms", roomId);
  const playerRef = doc(db, "rooms", roomId, "players", playerId);
  const playersCol = collection(db, "rooms", roomId, "players");

  await runTransaction(db, async (tx) => {
    const roomSnap = await tx.get(roomRef);
    if (!roomSnap.exists()) return;

    const room = roomSnap.data() as RoomDoc;

    const playerSnap = await tx.get(playerRef);
    if (!playerSnap.exists()) return;

    const leavingPlayer = playerSnap.data() as LeavingPlayerDoc;

    if (!leavingPlayer.authUid || leavingPlayer.authUid !== user.uid) {
      throw new Error("Not allowed to delete this player.");
    }

    const playersSnap = await getDocs(query(playersCol));
    const remainingPlayers = playersSnap.docs
      .filter((d) => d.id !== playerId)
      .map((d) => ({ id: d.id, ...(d.data() as RemainingPlayerDoc) }));

    if (remainingPlayers.length === 0) {
      tx.delete(playerRef);
      tx.delete(roomRef);
      return;
    }

    const nextHost =
      remainingPlayers.find((p) => p.alive !== false) ??
      remainingPlayers[0] ??
      null;

    if (leavingPlayer.isHost && nextHost) {
      const nextHostRef = doc(db, "rooms", roomId, "players", nextHost.id);

      tx.update(nextHostRef, { isHost: true });
      tx.update(roomRef, { hostAuthUid: nextHost.authUid ?? null });
    }

    const leavingWasHolder = room.currentBombHolder === playerId;
    if (leavingWasHolder) {
      const nextHolderId = nextHost?.id ?? remainingPlayers[0]?.id ?? null;
      tx.update(roomRef, { currentBombHolder: nextHolderId });
    }

    tx.delete(playerRef);
  });
}
