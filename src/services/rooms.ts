import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { Player, Room } from "../types/game";

export function generateRoomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createRoom(code?: string): Promise<Room> {
  const finalCode = code ?? generateRoomCode();

  const roomsRef = collection(db, "rooms");

  const docRef = await addDoc(roomsRef, {
    code: finalCode,
    status: "lobby",
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    code: finalCode,
    status: "lobby",
    createdAt: null,
  };
}

export async function addTestPlayer(roomId: string): Promise<Player> {
  const playersRef = collection(db, "rooms", roomId, "players");

  const docRef = await addDoc(playersRef, {
    name: "Test-spelare",
    isHost: false,
    role: null,
    joinedAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    name: "Test-spelare",
    isHost: false,
    role: null,
    joinedAt: null,
  };
}
