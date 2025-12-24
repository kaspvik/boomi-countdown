import { create } from "zustand";

type SpotlightState = {
  enabled: boolean;
  x: number;
  y: number;
  sizePx: number;
  strength: number;
};

type RoomFxState = {
  dim: number;
  spotlight: SpotlightState;
};

interface GameSessionState {
  activeRoomId: string | null;
  currentPlayerId: string | null;
  enterLobby: (roomId: string, playerId: string) => void;
  leaveLobby: () => void;

  roomFx: RoomFxState;
  setDim: (dim: number) => void;
  setSpotlight: (spotlight: Partial<SpotlightState>) => void;
  resetRoomFx: () => void;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const clamp0100 = (n: number) => Math.max(0, Math.min(100, n));

export const useGameStore = create<GameSessionState>((set) => ({
  activeRoomId: null,
  currentPlayerId: null,
  enterLobby: (roomId, playerId) =>
    set({ activeRoomId: roomId, currentPlayerId: playerId }),
  leaveLobby: () =>
    set({
      activeRoomId: null,
      currentPlayerId: null,
      roomFx: {
        dim: 0,
        spotlight: { enabled: false, x: 50, y: 82, sizePx: 260, strength: 1 },
      },
    }),

  roomFx: {
    dim: 0,
    spotlight: {
      enabled: false,
      x: 50,
      y: 82,
      sizePx: 260,
      strength: 1,
    },
  },

  setDim: (dim) =>
    set((s) => ({
      roomFx: {
        ...s.roomFx,
        dim: clamp01(dim),
      },
    })),

  setSpotlight: (spotlight) =>
    set((s) => ({
      roomFx: {
        ...s.roomFx,
        spotlight: {
          ...s.roomFx.spotlight,
          ...spotlight,
          x:
            spotlight.x === undefined
              ? s.roomFx.spotlight.x
              : clamp0100(spotlight.x),
          y:
            spotlight.y === undefined
              ? s.roomFx.spotlight.y
              : clamp0100(spotlight.y),
          strength:
            spotlight.strength === undefined
              ? s.roomFx.spotlight.strength
              : clamp01(spotlight.strength),
        },
      },
    })),

  resetRoomFx: () =>
    set((s) => ({
      roomFx: {
        ...s.roomFx,
        dim: 0,
        spotlight: { ...s.roomFx.spotlight, enabled: false },
      },
    })),
}));
