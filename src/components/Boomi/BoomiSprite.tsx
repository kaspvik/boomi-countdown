import { useTick } from "@pixi/react";
import { Assets, Sprite as PixiSprite, Texture } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { rowFrames } from "./spriteSheet";

type Props = { x: number; y: number; scale?: number };

export function BoomiSprite({ x, y, scale = 4 }: Props) {
  const spriteRef = useRef<PixiSprite | null>(null);
  const [sheet, setSheet] = useState<Texture | null>(null);

  const idxRef = useRef(0);
  const tRef = useRef(0);
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (loadedOnce.current) return; // undvik dubbel-load i StrictMode (dev)
    loadedOnce.current = true;

    let alive = true;
    (async () => {
      const tex = (await Assets.load("/Chomb3.png")) as Texture; // public/
      tex.source.scaleMode = "nearest"; // pixel-crisp
      if (alive) setSheet(tex);
    })();

    return () => {
      alive = false;
    };
  }, []);

  // EXEMPEL: rad 0, col 0–3
  const frames = useMemo(
    () => (sheet ? rowFrames(sheet, 0, 0, 3) : []),
    [sheet]
  );

  // sätt första texture när frames finns
  useEffect(() => {
    if (!spriteRef.current || frames.length === 0) return;
    idxRef.current = 0;
    tRef.current = 0;
    spriteRef.current.texture = frames[0];
  }, [frames]);

  useTick((ticker) => {
    if (!spriteRef.current || frames.length === 0) return;

    tRef.current += ticker.deltaTime / 60;
    if (tRef.current >= 0.1) {
      tRef.current = 0;
      idxRef.current = (idxRef.current + 1) % frames.length;
      spriteRef.current.texture = frames[idxRef.current];
    }
  });

  if (frames.length === 0) return null;

  return (
    <pixiSprite
      ref={spriteRef}
      texture={frames[0]}
      x={x}
      y={y}
      anchor={{ x: 0.5, y: 1 }} // mitten i X, botten i Y
      scale={scale}
    />
  );
}
