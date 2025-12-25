import { create } from "zustand";

export type BoomiAnim = "idle" | "tick" | "pass" | "explode";

type SpotlightState = {
  enabled: boolean;
  x: number;
  y: number;
  sizePx: number;
  strength: number;
};

type RoomFxState = {
  dim: number;
  flicker: number;
  alertRed: number; // 0..1
  spotlight: SpotlightState;
};

type BoomiFocusOptions = {
  x?: number;
  y?: number;
  strength?: number;
  delayMs?: number;
  dimOverride?: number;
  sizeOverridePx?: number;
};

interface GameSessionState {
  activeRoomId: string | null;
  currentPlayerId: string | null;
  enterLobby: (roomId: string, playerId: string) => void;
  leaveLobby: () => void;

  roomFx: RoomFxState;

  setDim: (dim: number) => void;
  setSpotlight: (spotlight: Partial<SpotlightState>) => void;
  setFlicker: (flicker: number) => void;
  setAlertRed: (strength: number) => void;

  fxReset: () => void;
  fxBoomiFocus: (anim: BoomiAnim, options?: BoomiFocusOptions) => void;
  fxSetFlickerBySeconds: (secondsLeft: number, enabled: boolean) => void;
  fxClearFlicker: () => void;

  fxRedPulseOn: (strength?: number) => void;
  fxRedPulseOff: () => void;

  _fxSpotlightTimeoutId: number | null;
}

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const clamp0100 = (n: number) => Math.max(0, Math.min(100, n));

const defaultSpotlight: SpotlightState = {
  enabled: false,
  x: 50,
  y: 84,
  sizePx: 280,
  strength: 1,
};

const defaultRoomFx: RoomFxState = {
  dim: 0,
  flicker: 0,
  alertRed: 0,
  spotlight: { ...defaultSpotlight },
};

const dimForAnim = (anim: BoomiAnim) =>
  anim === "explode" ? 0.85 : anim === "tick" ? 0.7 : 0.6;

const sizeForAnim = (anim: BoomiAnim) =>
  anim === "explode" ? 220 : anim === "tick" ? 260 : 280;

export const useGameStore = create<GameSessionState>((set, get) => ({
  activeRoomId: null,
  currentPlayerId: null,
  enterLobby: (roomId, playerId) =>
    set({ activeRoomId: roomId, currentPlayerId: playerId }),

  leaveLobby: () => {
    const spotId = get()._fxSpotlightTimeoutId;
    if (spotId) window.clearTimeout(spotId);

    set({
      activeRoomId: null,
      currentPlayerId: null,
      roomFx: { ...defaultRoomFx, spotlight: { ...defaultSpotlight } },
      _fxSpotlightTimeoutId: null,
    });
  },

  roomFx: { ...defaultRoomFx, spotlight: { ...defaultSpotlight } },
  _fxSpotlightTimeoutId: null,

  setDim: (dim) =>
    set((s) => ({
      roomFx: { ...s.roomFx, dim: clamp01(dim) },
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
          sizePx:
            spotlight.sizePx === undefined
              ? s.roomFx.spotlight.sizePx
              : Math.max(0, spotlight.sizePx),
        },
      },
    })),

  setFlicker: (flicker) =>
    set((s) => ({
      roomFx: { ...s.roomFx, flicker: clamp01(flicker) },
    })),

  setAlertRed: (strength) =>
    set((s) => ({
      roomFx: { ...s.roomFx, alertRed: clamp01(strength) },
    })),

  fxReset: () => {
    const spotId = get()._fxSpotlightTimeoutId;
    if (spotId) window.clearTimeout(spotId);

    set({
      roomFx: { ...defaultRoomFx, spotlight: { ...defaultSpotlight } },
      _fxSpotlightTimeoutId: null,
    });
  },

  fxBoomiFocus: (anim, options) => {
    const prevId = get()._fxSpotlightTimeoutId;
    if (prevId) window.clearTimeout(prevId);

    const dim = options?.dimOverride ?? dimForAnim(anim);
    const sizePx = options?.sizeOverridePx ?? sizeForAnim(anim);
    const x = options?.x ?? defaultSpotlight.x;
    const y = options?.y ?? defaultSpotlight.y;
    const strength = options?.strength ?? defaultSpotlight.strength;
    const delayMs = options?.delayMs ?? 180;

    set((s) => ({
      roomFx: {
        ...s.roomFx,
        dim: clamp01(dim),
        flicker: 0,
        // lämna alertRed som den är (pulse styrs separat)
        spotlight: {
          ...s.roomFx.spotlight,
          enabled: false,
          x: clamp0100(x),
          y: clamp0100(y),
          sizePx: Math.max(0, sizePx),
          strength: clamp01(strength),
        },
      },
      _fxSpotlightTimeoutId: null,
    }));

    const timeoutId = window.setTimeout(() => {
      set((s) => ({
        roomFx: {
          ...s.roomFx,
          spotlight: { ...s.roomFx.spotlight, enabled: true },
        },
        _fxSpotlightTimeoutId: null,
      }));
    }, delayMs);

    set({ _fxSpotlightTimeoutId: timeoutId });
  },

  fxSetFlickerBySeconds: (secondsLeft, enabled) => {
    if (!enabled) {
      set((s) => ({ roomFx: { ...s.roomFx, flicker: 0 } }));
      return;
    }

    const intensity = secondsLeft <= 3 ? 1 : secondsLeft <= 10 ? 0.75 : 0;

    set((s) => ({
      roomFx: { ...s.roomFx, flicker: clamp01(intensity) },
    }));
  },

  fxClearFlicker: () =>
    set((s) => ({
      roomFx: { ...s.roomFx, flicker: 0 },
    })),

  fxRedPulseOn: (strength = 0.95) =>
    set((s) => ({
      roomFx: { ...s.roomFx, alertRed: clamp01(strength) },
    })),

  fxRedPulseOff: () =>
    set((s) => ({
      roomFx: { ...s.roomFx, alertRed: 0 },
    })),
}));
