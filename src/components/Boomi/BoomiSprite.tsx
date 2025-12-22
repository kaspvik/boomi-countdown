import { extend, useTick } from "@pixi/react";
import { Sprite as PixiSprite } from "pixi.js";
import { useEffect, useRef } from "react";
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
import { getBoomiFps, isLoopAnim, type BoomiAnim } from "./boomiFrames";
import { useBoomiFrames } from "./hooks/useBoomiFrames";
import { useBoomiSheet } from "./hooks/useBoomiSheet";
import { useKeyTrigger } from "./hooks/useKeyTrigger";

extend({ Sprite: PixiSprite });

type Props = {
  x: number;
  y: number;
  scale?: number;
  anim: BoomiAnim;
  animKey: string;

  jumpKey?: string;

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

  const sheet = useBoomiSheet("/Chomb3.png");
  const frames = useBoomiFrames(sheet, anim);

  const frameAnim = useRef(createFrameAnimRuntime());

  const jumpIn = useRef(createJumpRuntime());
  const dropOut = useRef(createJumpRuntime());

  const { consume: consumeJump } = useKeyTrigger(jumpKey);
  const { consume: consumeExit } = useKeyTrigger(exitKey);

  const exiting = useRef(false);
  const exitDoneCalled = useRef(false);

  const explodeDoneCalled = useRef(false);

  useEffect(() => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    resetFrameAnim(frameAnim.current);
    explodeDoneCalled.current = false;

    s.visible = true;
    s.texture = frames[0];
  }, [frames, animKey]);

  useEffect(() => {
    if (!exitKey) return;
    exitDoneCalled.current = false;
  }, [exitKey]);

  useTick((ticker) => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    const dt = ticker.deltaTime / 60;

    s.x = x;

    if (consumeExit()) {
      exiting.current = true;

      s.visible = true;
      s.y = y;
      s.scale.set(scale);

      startBoomiDrop(dropOut.current, y);
    }

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

    if (consumeJump()) {
      s.visible = true;
      s.y = startBoomiJump(jumpIn.current, y);
    }

    const j = stepJump(jumpIn.current, dt);
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
