import type { Texture } from "pixi.js";
import { rowFrames } from "./functions/spriteSheet";

export type BoomiAnim = "idle" | "tick" | "pass" | "explode";

export function getBoomiFrames(sheet: Texture, anim: BoomiAnim) {
  switch (anim) {
    case "tick":
    case "pass":
      return rowFrames(sheet, 9, 0, 6); // 9.0–9.6
    case "explode":
      return rowFrames(sheet, 12, 0, 5); // 12.0–12.5
    case "idle":
    default:
      return rowFrames(sheet, 0, 0, 3);
  }
}

export function getBoomiFps(
  anim: BoomiAnim,
  fps: { idle: number; tick: number; pass: number; explode: number }
) {
  switch (anim) {
    case "explode":
      return fps.explode;
    case "pass":
      return fps.pass;
    case "tick":
      return fps.tick;
    default:
      return fps.idle;
  }
}

export function isLoopAnim(anim: BoomiAnim) {
  return anim !== "explode";
}
