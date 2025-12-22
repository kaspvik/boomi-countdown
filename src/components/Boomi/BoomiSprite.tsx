import { extend, useTick } from "@pixi/react";
import { Assets, Sprite as PixiSprite, Texture } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createFrameAnimRuntime,
  resetFrameAnim,
  stepFrameAnim,
} from "./animations/frameAnim";
import {
  createJumpRuntime,
  startBoomiDrop,
  startBoomiJump,
  stepJump,
} from "./animations/jump";
import {
  getBoomiFps,
  getBoomiFrames,
  isLoopAnim,
  type BoomiAnim,
} from "./boomiFrames";

extend({ Sprite: PixiSprite });

type Props = {
  x: number;
  y: number;
  scale?: number;
  anim: BoomiAnim;
  animKey: string;

  jumpKey?: string;

  // NEW
  exitKey?: string;
  onExitComplete?: () => void;

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
  exitKey,
  onExitComplete,
  onExplodeComplete,
  fpsIdle = 8,
  fpsTick = 10,
  fpsPass = 18,
  fpsExplode = 14,
}: Props) {
  const spriteRef = useRef<PixiSprite | null>(null);
  const [sheet, setSheet] = useState<Texture | null>(null);

  const jumpIn = useRef(createJumpRuntime());
  const dropOut = useRef(createJumpRuntime());
  const frameAnim = useRef(createFrameAnimRuntime());

  const pendingJump = useRef(false);
  const lastJumpKey = useRef<string | undefined>(undefined);

  const pendingExit = useRef(false);
  const lastExitKey = useRef<string | undefined>(undefined);
  const exiting = useRef(false);
  const exitDoneCalled = useRef(false);

  const explodeDoneCalled = useRef(false);
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

  const frames = useMemo(
    () => (sheet ? getBoomiFrames(sheet, anim) : []),
    [sheet, anim]
  );

  useEffect(() => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    resetFrameAnim(frameAnim.current);
    explodeDoneCalled.current = false;

    // Viktigt: gör synlig igen när anim byts
    s.visible = true;
    s.texture = frames[0];
  }, [frames, animKey]);

  useEffect(() => {
    if (!jumpKey) return;
    if (lastJumpKey.current === jumpKey) return;
    lastJumpKey.current = jumpKey;
    pendingJump.current = true;
  }, [jumpKey]);

  useEffect(() => {
    if (!exitKey) return;
    if (lastExitKey.current === exitKey) return;
    lastExitKey.current = exitKey;
    pendingExit.current = true;
    exitDoneCalled.current = false;
  }, [exitKey]);

  useTick((ticker) => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    const dt = ticker.deltaTime / 60;

    s.x = x;

    // Start drop-out
    if (pendingExit.current) {
      pendingExit.current = false;
      exiting.current = true;
      s.visible = true;
      s.y = y;
      s.scale.set(scale);
      startBoomiDrop(dropOut.current, y);
    }

    // While exiting: animate drop, then hide and callback
    if (exiting.current) {
      const d = stepJump(dropOut.current, dt);
      if (!d.done) {
        s.y = d.y;
        s.scale.set(scale * d.scaleX, scale * d.scaleY);
        return;
      }

      s.visible = false;
      s.y = y;
      s.scale.set(scale);

      exiting.current = false;

      if (!exitDoneCalled.current) {
        exitDoneCalled.current = true;
        onExitComplete?.();
      }
      return;
    }

    // Start jump-in
    if (pendingJump.current) {
      pendingJump.current = false;
      s.visible = true;
      s.y = startBoomiJump(jumpIn.current, y);
    }

    // Animate jump-in
    const j = stepJump(jumpIn.current, dt);
    if (!j.done) {
      s.y = j.y;
      s.scale.set(scale * j.scaleX, scale * j.scaleY);
    } else {
      s.y = y;
      s.scale.set(scale);
    }

    // Frame animation
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

    if (step.advanced) s.texture = frames[step.idx];

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
