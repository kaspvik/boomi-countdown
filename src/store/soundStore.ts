import { create } from "zustand";
import { SFX } from "../services/audio/sfx";

export type SfxKey = "hello1" | "hello2" | "hello3" | "laugh" | "ohno" | "pass";

type SoundState = {
  sfxMuted: boolean;
  sfxVolume: number;

  setSfxMuted: (muted: boolean) => void;
  setSfxVolume: (volume: number) => void;

  playSfx: (key: SfxKey) => void;
  playRandomHello: () => void;
};

const helloKeys: SfxKey[] = ["hello1", "hello2", "hello3"];

export const useSoundStore = create<SoundState>((set, get) => ({
  sfxMuted: false,
  sfxVolume: 0.6,

  setSfxMuted: (muted) => {
    set({ sfxMuted: muted });
    SFX.setMuted(muted);
  },

  setSfxVolume: (volume) => {
    const v = Math.max(0, Math.min(1, volume));
    set({ sfxVolume: v });
    SFX.setVolume(v);
  },

  playSfx: (key) => {
    if (get().sfxMuted) return;
    SFX.play(key);
  },

  playRandomHello: () => {
    if (get().sfxMuted) return;
    const key = helloKeys[Math.floor(Math.random() * helloKeys.length)];
    SFX.play(key);
  },
}));
