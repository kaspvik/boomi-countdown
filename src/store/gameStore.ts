import { create } from "zustand";

type Screen = "start" | "lobby";

interface GameState {
  screen: Screen;
  activeRoomId: string | null;
  currentPlayerId: string | null;
  enterLobby: (roomId: string, playerId: string) => void;
  leaveLobby: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  screen: "start",
  activeRoomId: null,
  currentPlayerId: null,

  enterLobby: (roomId, playerId) =>
    set(() => ({
      screen: "lobby",
      activeRoomId: roomId,
      currentPlayerId: playerId,
    })),

  leaveLobby: () =>
    set(() => ({
      screen: "start",
      activeRoomId: null,
      currentPlayerId: null,
    })),
}));
