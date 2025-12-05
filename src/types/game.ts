import type { Timestamp } from "firebase/firestore";

export type RoomStatus = "lobby" | "in_progress" | "finished";
export type RoomPhase = "role_reveal" | "round";
export type Role = "imposter" | "civilian";

export interface Room {
  id: string;
  code: string;

  status: RoomStatus;
  round: number;
  currentBombHolder: string | null;
  createdAt?: Timestamp | null;
  phase?: RoomPhase;
}

export interface Player {
  id: string;
  name: string;
  role?: Role | null;
  isHost: boolean;
  alive: boolean;
  joinedAt?: Timestamp | null;
  hasAcknowledgedRole?: boolean;
}
