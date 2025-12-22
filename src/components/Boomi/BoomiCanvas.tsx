import { Application } from "@pixi/react";
import { BoomiSprite } from "./BoomiSprite";
import type { BoomiAnim } from "./boomiFrames";

export function BoomiCanvas(props: {
  visibleKey: string;
  anim: BoomiAnim;
  animKey: string;

  // NEW: trigger drop-out
  exitKey?: string;
  onExitComplete?: () => void;

  onExplodeComplete?: () => void;
}) {
  const {
    visibleKey,
    anim,
    animKey,
    exitKey,
    onExitComplete,
    onExplodeComplete,
  } = props;

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
        exitKey={exitKey}
        onExitComplete={onExitComplete}
        onExplodeComplete={onExplodeComplete}
      />
    </Application>
  );
}
