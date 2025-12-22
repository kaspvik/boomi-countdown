import { Application } from "@pixi/react";
import { BoomiSprite } from "./BoomiSprite";
import "./pixiSetup";

export function BoomiCanvas() {
  return (
    <Application
      width={400}
      height={300}
      backgroundAlpha={0}
      antialias={false}
      autoStart>
      <BoomiSprite x={200} y={260} scale={6} />
    </Application>
  );
}
