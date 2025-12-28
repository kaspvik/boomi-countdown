import { Howl } from "howler";

type SfxKey =
  | "hello1"
  | "hello2"
  | "hello3"
  | "laugh"
  | "ohno"
  | "pass"
  | "click"
  | "tickdown"
  | "explosion";

const make = (src: string, volume = 0.6) =>
  new Howl({
    src: [src],
    volume,
    preload: true,
  });

const sfx: Record<SfxKey, Howl> = {
  hello1: make("/audio/hello1.mp3", 0.5),
  hello2: make("/audio/hello2.mp3", 0.4),
  hello3: make("/audio/hello3.mp3", 0.7),
  laugh: make("/audio/laugh.mp3", 0.6),
  ohno: make("/audio/ohno.mp3", 0.55),
  pass: make("/audio/pass.mp3", 0.55),
  click: make("/audio/button-press-382713.mp3", 0.6),
  tickdown: make("/audio/clock-ticking-down-376897.mp3", 0.35),
  explosion: make("/audio/pixel-explosion-319166.mp3", 0.75),
};

let muted = false;

export const SFX = {
  play(key: SfxKey) {
    if (muted) return;
    sfx[key].stop();
    sfx[key].play();
  },
  stop(key: SfxKey) {
    sfx[key].stop();
  },
  stopAll() {
    Object.values(sfx).forEach((h) => h.stop());
  },
  setMuted(value: boolean) {
    muted = value;
  },
  setVolume(value: number) {
    Object.values(sfx).forEach((h) => h.volume(value));
  },
};
