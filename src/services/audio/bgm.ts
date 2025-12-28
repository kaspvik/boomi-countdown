import { Howl } from "howler";

const tracks = {
  boomi: new Howl({
    src: ["/audio/BoomiCountdown.mp3"],
    loop: true,
    volume: 0.35,
    preload: true,
  }),
} as const;

export type BgmKey = keyof typeof tracks;

let currentKey: BgmKey | null = null;

let stopToken = 0;

export const BGM = {
  play(key: BgmKey) {
    const prevKey = currentKey;

    if (prevKey === key && tracks[key].playing()) return;

    if (prevKey) {
      tracks[prevKey].stop();
    }

    currentKey = key;
    tracks[key].play();
  },

  stop() {
    const key = currentKey;
    if (!key) return;

    tracks[key].stop();
    currentKey = null;
  },

  playWithFade(key: BgmKey, targetVolume: number, ms = 600) {
    stopToken += 1;

    const prevKey = currentKey;
    if (prevKey) {
      tracks[prevKey].stop();
    }

    currentKey = key;

    const t = tracks[key];

    t.volume(0);

    if (!t.playing()) {
      t.play();
    }

    t.fade(0, targetVolume, ms);
  },

  stopWithFade(ms = 500) {
    const key = currentKey;
    if (!key) return;

    stopToken += 1;
    const myToken = stopToken;

    const t = tracks[key];

    const from = t.volume();
    t.fade(from, 0, ms);

    window.setTimeout(() => {
      if (stopToken !== myToken) return;

      t.stop();
      currentKey = null;
    }, ms);
  },

  setMuted(muted: boolean) {
    const key = currentKey;
    if (!key) return;

    tracks[key].mute(muted);
  },

  setVolume(volume: number) {
    const key = currentKey;
    if (!key) return;

    tracks[key].volume(volume);
  },

  fadeTo(volume: number, ms = 350) {
    const key = currentKey;
    if (!key) return;

    const t = tracks[key];
    t.fade(t.volume(), volume, ms);
  },
};
