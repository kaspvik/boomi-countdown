import { useTick } from "@pixi/react";
import { Assets, Sprite as PixiSprite, Texture } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { createJumpRuntime, startJump, stepJump } from "./animations/jump";
import { rowFrames } from "./functions/spriteSheet";

type Props = { x: number; y: number; scale?: number };

export function BoomiSprite({ x, y, scale = 4 }: Props) {
  const spriteRef = useRef<PixiSprite | null>(null);
  const [sheet, setSheet] = useState<Texture | null>(null);

  const idxRef = useRef(0);
  const tRef = useRef(0);

  const jumpRef = useRef(createJumpRuntime());

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
    () => (sheet ? rowFrames(sheet, 0, 0, 3) : []),
    [sheet]
  );

  useEffect(() => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    idxRef.current = 0;
    tRef.current = 0;
    s.texture = frames[0];

    const startY = startJump(jumpRef.current, y, {
      duration: 0.45,
      startOffset: 300,
      bounce: 92,
      squash: 0.25,
    });

    s.x = x;
    s.y = startY;
    s.scale.set(scale);
  }, [frames, x, y, scale]);

  useTick((ticker) => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    const dt = ticker.deltaTime / 60;

    tRef.current += dt;
    if (tRef.current >= 0.1) {
      tRef.current = 0;
      idxRef.current = (idxRef.current + 1) % frames.length;
      s.texture = frames[idxRef.current];
    }

    s.x = x;

    if (jumpRef.current.active) {
      const j = stepJump(jumpRef.current, dt);
      s.y = j.y;
      s.scale.set(scale * j.scaleX, scale * j.scaleY);
    } else {
      s.y = y;
      s.scale.set(scale);
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
