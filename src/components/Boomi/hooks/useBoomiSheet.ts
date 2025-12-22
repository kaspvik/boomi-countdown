import { Assets, Texture } from "pixi.js";
import { useEffect, useRef, useState } from "react";

export function useBoomiSheet(url: string) {
  const [sheet, setSheet] = useState<Texture | null>(null);
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (loadedOnce.current) return;
    loadedOnce.current = true;

    let alive = true;
    (async () => {
      const tex = (await Assets.load(url)) as Texture;
      tex.source.scaleMode = "nearest";
      if (alive) setSheet(tex);
    })();

    return () => {
      alive = false;
    };
  }, [url]);

  return sheet;
}
