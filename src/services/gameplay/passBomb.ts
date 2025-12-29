import { doc, runTransaction } from "firebase/firestore";
import { db } from "../../firebase";
import type { Player, Room } from "../../types/game";

type RoomTx = Pick<Room, "status" | "round" | "currentBombHolder"> & {
  passCardUsedThisRound?: boolean;
};

type PlayerTx = Pick<Player, "alive" | "blockActiveRound" | "passUsedRound">;

export async function passBomb(
  roomId: string,
  fromPlayerId: string,
  toPlayerId: string
): Promise<void> {
  const roomRef = doc(db, "rooms", roomId);
  const fromRef = doc(db, "rooms", roomId, "players", fromPlayerId);
  const toRef = doc(db, "rooms", roomId, "players", toPlayerId);

  await runTransaction(db, async (tx) => {
    const [roomSnap, fromSnap, toSnap] = await Promise.all([
      tx.get(roomRef),
      tx.get(fromRef),
      tx.get(toRef),
    ]);

    if (!roomSnap.exists()) throw new Error("Room not found");
    if (!fromSnap.exists()) throw new Error("From-player not found");
    if (!toSnap.exists()) throw new Error("To-player not found");

    const room = roomSnap.data() as RoomTx;
    const from = fromSnap.data() as PlayerTx;
    const to = toSnap.data() as PlayerTx;

    if (room.status !== "in_progress") throw new Error("Game not in progress");
    if (room.currentBombHolder !== fromPlayerId) {
      throw new Error("Not bomb holder");
    }
    if (from.alive === false) throw new Error("You are dead");
    if (to.alive === false) throw new Error("Target is dead");

    if (to.blockActiveRound != null && to.blockActiveRound === room.round) {
      throw new Error("Target is blocked this round");
    }

    if (from.passUsedRound === room.round) {
      throw new Error("Already passed this round");
    }

    tx.update(roomRef, {
      currentBombHolder: toPlayerId,
    });

    tx.update(fromRef, {
      passUsedRound: room.round,
    });
  });
}
