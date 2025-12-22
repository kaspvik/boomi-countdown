import { Application } from "@pixi/react";
import { BoomiSprite } from "./BoomiSprite";
import "./pixiSetup";

export function BoomiCanvas({ visibleKey }: { visibleKey: string }) {
  return (
    <Application
      key={visibleKey}
      width={400}
      height={300}
      backgroundAlpha={0}
      antialias={false}
      autoStart>
      <BoomiSprite x={200} y={230} scale={7} />
    </Application>
  );
}
