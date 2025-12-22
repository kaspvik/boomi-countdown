import type { Texture } from "pixi.js";
import { rowFrames } from "./functions/spriteSheet";

export type BoomiAnim = "idle" | "tick" | "pass" | "explode";

export function getBoomiFrames(sheet: Texture, anim: BoomiAnim) {
  switch (anim) {
    case "tick":
    case "pass":
      return rowFrames(sheet, 9, 0, 6); // 9.0 - 9.6
    case "explode":
      return rowFrames(sheet, 12, 0, 5); // 12.0 - 12.5
    case "idle":
    default:
      return rowFrames(sheet, 0, 0, 3);
  }
}
