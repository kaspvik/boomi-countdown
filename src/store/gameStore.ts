import { create } from "zustand";

interface GameSessionState {
  activeRoomId: string | null;
  currentPlayerId: string | null;
  enterLobby: (roomId: string, playerId: string) => void;
  leaveLobby: () => void;
}

export const useGameStore = create<GameSessionState>((set) => ({
  activeRoomId: null,
  currentPlayerId: null,
  enterLobby: (roomId, playerId) =>
    set({ activeRoomId: roomId, currentPlayerId: playerId }),
  leaveLobby: () => set({ activeRoomId: null, currentPlayerId: null }),
}));
