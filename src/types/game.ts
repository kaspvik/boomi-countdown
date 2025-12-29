import type { Timestamp } from "firebase/firestore";

export type RoomStatus = "lobby" | "in_progress" | "finished";
export type RoomPhase =
  | "role_reveal"
  | "question"
  | "question_results"
  | "round"
  | "round_results"
  | "game_over";

export type Role = "imposter" | "civilian";

export interface Room {
  id: string;
  code: string;

  status: RoomStatus;
  round: number;
  currentBombHolder: string | null;
  createdAt?: Timestamp | null;
  phase?: RoomPhase | null;

  lastKilledPlayerId?: string | null;
  roundResultsStep?: "explosion" | "role" | "status" | null;
  winner?: "civilians" | "imposters" | null;

  passCardUsedThisRound?: boolean;
  roundTimePenaltySeconds?: number;
  timerStartedAt: Timestamp | null;

  hostAuthUid?: string | null;
}

export interface Player {
  id: string;
  name: string;
  role?: Role | null;
  isHost: boolean;
  alive: boolean;
  joinedAt?: Timestamp | null;
  hasAcknowledgedRole?: boolean;

  authUid: string | null;

  blockCardUsed?: boolean;
  blockActiveRound?: number | null;

  passUsedRound?: number | null;
}
export interface RoundVote {
  id: string;
  voterId: string;
  targetPlayerId: string;
  roleAtTime: Role | null;
  round: number;
}
