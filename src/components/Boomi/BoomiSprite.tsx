import { useTick } from "@pixi/react";
import { Assets, Sprite as PixiSprite, Texture } from "pixi.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { rowFrames } from "./spriteSheet";

type Props = {
  scale?: number;
  dockBottom?: boolean;
  jumpKey?: string; // valfri: ändras => trigga hopp igen
};

export function BoomiSprite({ scale = 5, dockBottom = true, jumpKey }: Props) {
  const spriteRef = useRef<PixiSprite | null>(null);
  const [sheet, setSheet] = useState<Texture | null>(null);

  // spritesheet animation
  const frameIdx = useRef(0);
  const frameAcc = useRef(0);

  // jump physics
  const y = useRef(0);
  const vy = useRef(0);
  const jumping = useRef(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const tex = (await Assets.load("/Chomb3.png")) as Texture; // public/
      tex.source.scaleMode = "nearest";
      if (alive) setSheet(tex);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Exempel: rad 0, col 0–3
  const frames = useMemo(
    () => (sheet ? rowFrames(sheet, 0, 0, 3) : []),
    [sheet]
  );

  // trigga hopp när sprite + frames är redo (och även när jumpKey ändras)
  useEffect(() => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    // start texture
    frameIdx.current = 0;
    frameAcc.current = 0;
    s.texture = frames[0];

    // starta "heavy jump" från under bordet
    const h = (s.parent as any)?.height ?? 300;
    const boardY = dockBottom ? h - 40 : h / 2;

    y.current = boardY + 210; // start under bordet
    vy.current = -900; // uppåt (px/s), större = mer "kick"
    jumping.current = true;

    s.y = y.current;
    s.scale.set(scale);
  }, [frames, jumpKey, dockBottom, scale]);

  useTick((ticker) => {
    const s = spriteRef.current;
    if (!s || frames.length === 0) return;

    // dt i sekunder (riktiga ms)
    const dt = ticker.elapsedMS / 1000;

    // --- 1) idle-frames (10 fps) ---
    frameAcc.current += dt;
    if (frameAcc.current >= 0.1) {
      frameAcc.current = 0;
      frameIdx.current = (frameIdx.current + 1) % frames.length;
      s.texture = frames[frameIdx.current];
    }

    // --- 2) positionera på bordet ---
    const w = (s.parent as any)?.width ?? 400;
    const h = (s.parent as any)?.height ?? 300;
    s.x = w / 2;

    const boardY = dockBottom ? h - 40 : h / 2;

    // --- 3) heavy jump physics ---
    if (jumping.current) {
      const GRAVITY = 2600; // px/s^2 (större = tyngre fall)
      const BOUNCE = 0.22; // 0..1 (mindre = dör snabbare)
      const STOP_VY = 110; // px/s (när studsen är liten nog, stoppa)

      vy.current += GRAVITY * dt;
      y.current += vy.current * dt;

      // landning + studs
      if (y.current >= boardY) {
        y.current = boardY;

        if (Math.abs(vy.current) > STOP_VY) {
          vy.current = -vy.current * BOUNCE; // studs upp, dämpad
        } else {
          vy.current = 0;
          jumping.current = false; // klar
        }
      }

      s.y = y.current;

      // squash/stretch: lite stretch i luften, squash vid impact
      const inAir = y.current < boardY - 2;
      if (inAir) {
        s.scale.set(scale * 0.95, scale * 1.05);
      } else {
        // precis vid markkontakt
        s.scale.set(scale * 1.08, scale * 0.92);
      }
    } else {
      // stabilt på bordet när hoppen är klar
      s.y = boardY;
      s.scale.set(scale);
    }
  });

  if (frames.length === 0) return null;

  return <pixiSprite ref={spriteRef} texture={frames[0]} anchor={0.5} />;
}
