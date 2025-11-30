import type { Timestamp } from "firebase/firestore";

export type Role = "bomber" | "civilian";

export interface Room {
  id: string;
  code: string;
  status: "lobby" | "running" | "finished";
  createdAt?: Timestamp | null;
}

export interface Player {
  id: string;
  name: string;
  role?: Role | null;
  isHost: boolean;
  joinedAt?: Timestamp | null;
}
