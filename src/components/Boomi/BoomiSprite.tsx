import { useTick } from "@pixi/react";
import { Assets, Sprite as PixiSprite, Texture } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { getBoomiFrames, type BoomiAnim } from "./boomiFrames";

type Props = {
  x: number;
  y: number;
  scale?: number;

  anim: BoomiAnim;
  animKey: string;

  onExplodeComplete?: () => void;

  fpsIdle?: number;
  fpsTick?: number;
  fpsPass?: number;
  fpsExplode?: number;
};

export function BoomiSprite({
  x,
  y,
  scale = 4,
  anim,
  animKey,
  onExplodeComplete,
  fpsIdle = 8,
  fpsTick = 10,
  fpsPass = 18,
  fpsExplode = 14,
}: Props) {
  const spriteRef = useRef<PixiSprite | null>(null);
  const [sheet, setSheet] = useState<Texture | null>(null);

  const idxRef = useRef(0);
  const tRef = useRef(0);
  const didCompleteExplodeRef = useRef(false);

  const loadedOnce = useRef(false);

  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;

    let alive = true;
    (async () => {
      const tex = (await Assets.load("/Chomb3.png")) as Texture;
      tex.source.scaleMode = "nearest";
      if (alive) setSheet(tex);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const frames = useMemo(() => {
    if (!sheet) return [];
    return getBoomiFrames(sheet, anim);
  }, [sheet, anim]);

  useEffect(() => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    idxRef.current = 0;
    tRef.current = 0;
    didCompleteExplodeRef.current = false;
    s.texture = frames[0];
  }, [frames, animKey]);

  useTick((ticker) => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    s.x = x;
    s.y = y;
    s.scale.set(scale);

    const fps =
      anim === "explode"
        ? fpsExplode
        : anim === "pass"
        ? fpsPass
        : anim === "tick"
        ? fpsTick
        : fpsIdle;

    const frameTime = 1 / fps;

    tRef.current += ticker.deltaTime / 60;
    if (tRef.current < frameTime) return;
    tRef.current = 0;

    if (anim === "explode") {
      if (idxRef.current < frames.length - 1) {
        idxRef.current += 1;
        s.texture = frames[idxRef.current];
      } else {
        onExplodeComplete?.();
      }
      return;
    }

    idxRef.current = (idxRef.current + 1) % frames.length;
    s.texture = frames[idxRef.current];
  });

  if (frames.length === 0) return null;

  return (
    <pixiSprite
      ref={spriteRef}
      texture={frames[0]}
      x={x}
      y={y}
      anchor={{ x: 0.5, y: 1 }}
      scale={scale}
    />
  );
}
