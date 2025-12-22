import { useTick } from "@pixi/react";
import { Assets, Sprite as PixiSprite, Texture } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { createJumpRuntime, startJump, stepJump } from "./animations/jump";
import { getBoomiFrames, type BoomiAnim } from "./boomiFrames";

type Props = {
  x: number;
  y: number;
  scale?: number;
  anim: BoomiAnim;
  animKey: string;
  jumpKey?: string;
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
  jumpKey,
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

  const jumpRef = useRef(createJumpRuntime());
  const pendingJumpRef = useRef(false);
  const lastJumpKeyRef = useRef<string | undefined>(undefined);

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
    s.texture = frames[0];
  }, [frames, animKey]);

  useEffect(() => {
    if (!jumpKey) return;
    if (lastJumpKeyRef.current === jumpKey) return;

    lastJumpKeyRef.current = jumpKey;
    pendingJumpRef.current = true;
  }, [jumpKey]);

  useTick((ticker) => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    const dt = ticker.deltaTime / 60;

    s.x = x;

    if (pendingJumpRef.current) {
      pendingJumpRef.current = false;

      const startY = startJump(jumpRef.current, y, {
        duration: 0.45,
        startOffset: 120,
        bounce: 12,
        squash: 0.18,
      });

      s.y = startY;
    }

    const j = stepJump(jumpRef.current, dt);
    if (!j.done) {
      s.y = j.y;
      s.scale.set(scale * j.scaleX, scale * j.scaleY);
    } else {
      s.y = y;
      s.scale.set(scale);
    }

    const fps =
      anim === "explode"
        ? fpsExplode
        : anim === "pass"
        ? fpsPass
        : anim === "tick"
        ? fpsTick
        : fpsIdle;

    const frameTime = 1 / fps;

    tRef.current += dt;
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
