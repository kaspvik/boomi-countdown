import { Application } from "@pixi/react";
import { BoomiSprite } from "./BoomiSprite";
import type { BoomiAnim } from "./boomiFrames";

export function BoomiCanvas(props: {
  visibleKey: string;
  anim: BoomiAnim;
  animKey: string;
  onExplodeComplete?: () => void;
}) {
  const { visibleKey, anim, animKey, onExplodeComplete } = props;

  return (
    <Application
      key={visibleKey}
      width={400}
      height={300}
      backgroundAlpha={0}
      antialias={false}
      autoStart>
      <BoomiSprite
        x={200}
        y={230}
        scale={7}
        anim={anim}
        animKey={animKey}
        jumpKey={visibleKey}
        onExplodeComplete={onExplodeComplete}
      />
    </Application>
  );
}
