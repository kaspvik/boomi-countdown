import { create } from "zustand";
import { BGM, type BgmKey } from "../services/audio/bgm";
import { SFX } from "../services/audio/sfx";

export type SfxKey =
  | "hello1"
  | "hello2"
  | "hello3"
  | "laugh"
  | "ohno"
  | "pass"
  | "click"
  | "tickdown"
  | "explosion";

type SoundState = {
  sfxMuted: boolean;
  sfxVolume: number;

  setSfxMuted: (muted: boolean) => void;
  setSfxVolume: (volume: number) => void;

  playSfx: (key: SfxKey) => void;
  stopSfx: (key: SfxKey) => void;
  playRandomHello: () => void;

  bgmMuted: boolean;
  bgmVolume: number;
  currentBgm: BgmKey | null;

  setBgmMuted: (muted: boolean) => void;
  setBgmVolume: (volume: number) => void;

  playBgm: (key: BgmKey) => void;
  stopBgm: () => void;
};

const helloKeys: SfxKey[] = ["hello1", "hello2", "hello3", "laugh", "ohno"];

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

  bgmMuted: false,
  bgmVolume: 0.35,
  currentBgm: null,

  setBgmMuted: (muted) => {
    set({ bgmMuted: muted });
    BGM.setMuted(muted);
  },

  setBgmVolume: (volume) => {
    const v = Math.max(0, Math.min(1, volume));
    set({ bgmVolume: v });
    BGM.setVolume(v);
  },

  playBgm: (key) => {
    const { bgmMuted, bgmVolume } = get();
    set({ currentBgm: key });

    if (bgmMuted) return;

    BGM.playWithFade(key, bgmVolume, 600);
  },

  stopBgm: () => {
    set({ currentBgm: null });
    BGM.stopWithFade(500);
  },

  stopSfx: (key) => {
    SFX.stop(key);
  },
}));
