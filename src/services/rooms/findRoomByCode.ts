import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import type { Room } from "../../types/game";

export async function findRoomByCode(code: string): Promise<Room | null> {
  const roomsRef = collection(db, "rooms");

  const q = query(roomsRef, where("code", "==", code), limit(1));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const docSnap = snapshot.docs[0];
  const data = docSnap.data();

  return {
    id: docSnap.id,
    code: data.code,
    status: data.status,
    createdAt: data.createdAt ?? null,
  };
}
