import { Howl } from "howler";

export type BgmKey = "lobby";

const tracks: Record<BgmKey, Howl> = {
  lobby: new Howl({
    src: ["/audio/BoomiCountdown.mp3"],
    loop: true,
    volume: 0.35,
    preload: true,
  }),
};

let currentKey: BgmKey | null = null;

export const BGM = {
  play(key: BgmKey) {
    if (currentKey === key && tracks[key].playing()) return;

    // stoppa ev. tidigare track
    if (currentKey) {
      tracks[currentKey].stop();
    }

    currentKey = key;
    tracks[key].play();
  },

  stop() {
    if (!currentKey) return;
    tracks[currentKey].stop();
    currentKey = null;
  },

  setMuted(muted: boolean) {
    if (!currentKey) return;
    tracks[currentKey].mute(muted);
  },

  setVolume(volume: number) {
    if (!currentKey) return;
    tracks[currentKey].volume(volume);
  },

  fadeTo(volume: number, ms = 350) {
    if (!currentKey) return;
    const t = tracks[currentKey];
    t.fade(t.volume(), volume, ms);
  },
};
