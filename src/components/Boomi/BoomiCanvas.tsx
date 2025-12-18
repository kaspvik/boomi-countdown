// src/game/BoomiCanvas.tsx
import { Application } from "@pixi/react";
import { useRef } from "react";
import { BoomiSprite } from "./BoomiSprite";
import "./pixiSetup";

export function BoomiCanvas({ visibleKey }: { visibleKey: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
      <Application
        resizeTo={wrapRef}
        backgroundAlpha={0}
        antialias={false}
        autoStart>
        <BoomiSprite jumpKey={visibleKey} dockBottom scale={5} />
      </Application>
    </div>
  );
}
