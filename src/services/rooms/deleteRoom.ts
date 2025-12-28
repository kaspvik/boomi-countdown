// services/rooms/deleteRoom.ts
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ensureSignedIn } from "../auth/authService";

async function deleteCollectionInBatches(
  colPath: string,
  batchSize = 400
): Promise<void> {
  const colRef = collection(db, colPath);

  while (true) {
    const snap = await getDocs(query(colRef, limit(batchSize)));
    if (snap.empty) break;

    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
}

export async function deleteRoom(roomId: string) {
  const user = await ensureSignedIn();

  const roomRef = doc(db, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) return;

  const room = roomSnap.data() as { hostAuthUid?: string | null };

  if (!room.hostAuthUid || room.hostAuthUid !== user.uid) {
    throw new Error("Only the host can delete the room.");
  }

  await deleteCollectionInBatches(`rooms/${roomId}/players`);
  await deleteCollectionInBatches(`rooms/${roomId}/votes`);

  await deleteDoc(roomRef);
}
