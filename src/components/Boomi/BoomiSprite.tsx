import { extend, useTick } from "@pixi/react";
import { Assets, Sprite as PixiSprite, Texture } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createFrameAnimRuntime,
  resetFrameAnim,
  stepFrameAnim,
} from "./animations/frameAnim";
import { createJumpRuntime, startBoomiJump, stepJump } from "./animations/jump";
import {
  getBoomiFps,
  getBoomiFrames,
  isLoopAnim,
  type BoomiAnim,
} from "./boomiFrames";

// Register Pixi components for @pixi/react v8 intrinsic elements (<pixiSprite /> etc)
extend({ Sprite: PixiSprite });

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

  const jump = useRef(createJumpRuntime());
  const frameAnim = useRef(createFrameAnimRuntime());

  const pendingJump = useRef(false);
  const lastJumpKey = useRef<string | undefined>(undefined);

  const explodeDoneCalled = useRef(false);
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (loadedOnce.current) return; // StrictMode dev-guard
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

  const frames = useMemo(
    () => (sheet ? getBoomiFrames(sheet, anim) : []),
    [sheet, anim]
  );

  useEffect(() => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    resetFrameAnim(frameAnim.current);
    explodeDoneCalled.current = false;
    s.texture = frames[0];
  }, [frames, animKey]);

  useEffect(() => {
    if (!jumpKey) return;
    if (lastJumpKey.current === jumpKey) return;

    lastJumpKey.current = jumpKey;
    pendingJump.current = true;
  }, [jumpKey]);

  useTick((ticker) => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    const dt = ticker.deltaTime / 60;

    s.x = x;

    if (pendingJump.current) {
      pendingJump.current = false;
      s.y = startBoomiJump(jump.current, y);
    }

    const j = stepJump(jump.current, dt);
    if (!j.done) {
      s.y = j.y;
      s.scale.set(scale * j.scaleX, scale * j.scaleY);
    } else {
      s.y = y;
      s.scale.set(scale);
    }

    const fps = getBoomiFps(anim, {
      idle: fpsIdle,
      tick: fpsTick,
      pass: fpsPass,
      explode: fpsExplode,
    });

    const loop = isLoopAnim(anim);
    const step = stepFrameAnim({
      r: frameAnim.current,
      dt,
      fps,
      frameCount: frames.length,
      loop,
    });

    if (step.advanced) {
      s.texture = frames[step.idx];
    }

    if (!loop && step.done && !explodeDoneCalled.current) {
      explodeDoneCalled.current = true;
      onExplodeComplete?.();
    }
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
