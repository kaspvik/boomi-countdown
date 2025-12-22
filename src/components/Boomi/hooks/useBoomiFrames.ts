import type { Texture } from "pixi.js";
import { useMemo } from "react";
import { getBoomiFrames, type BoomiAnim } from "../boomiFrames";

export function useBoomiFrames(sheet: Texture | null, anim: BoomiAnim) {
  return useMemo(
    () => (sheet ? getBoomiFrames(sheet, anim) : []),
    [sheet, anim]
  );
}
