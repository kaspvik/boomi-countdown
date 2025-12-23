import React, { useMemo } from "react";
import styles from "../BoomiCardAnimation/BoomiCardAnim.module.css";

export type BoomiAnim = "idle" | "tick" | "pass" | "block" | "explode";

type Props = {
  anim: BoomiAnim;
  scale?: number;
  fps?: number;
  loop?: boolean;
  className?: string;
  onDone?: () => void;
};

type CSSVars = React.CSSProperties & {
  "--fromX": string;
  "--toX": string;
  "--y": string;
};

const CELL = 32;

function animMeta(anim: BoomiAnim) {
  switch (anim) {
    case "tick":
      return {
        row: 9,
        fromCol: 0,
        toCol: 11,
        defaultFps: 10,
        defaultLoop: true,
      };

    case "pass":
      return {
        row: 4,
        fromCol: 0,
        toCol: 5,
        defaultFps: 6,
        defaultLoop: true,
      };

    case "block":
      return {
        row: 7,
        fromCol: 0,
        toCol: 3,
        defaultFps: 6,
        defaultLoop: true,
      };

    case "explode":
      return {
        row: 12,
        fromCol: 0,
        toCol: 5,
        defaultFps: 14,
        defaultLoop: false,
      };

    case "idle":
    default:
      return { row: 0, fromCol: 0, toCol: 3, defaultFps: 8, defaultLoop: true };
  }
}

export const BoomiCardAnim: React.FC<Props> = ({
  anim,
  scale = 4,
  fps,
  loop,
  className,
  onDone,
}) => {
  const meta = useMemo(() => animMeta(anim), [anim]);

  const frameCount = meta.toCol - meta.fromCol + 1;
  const useFps = fps ?? meta.defaultFps;
  const useLoop = loop ?? meta.defaultLoop;

  const durationS = frameCount / Math.max(1, useFps);

  const fromX = -(meta.fromCol * CELL);
  const toX = -((meta.toCol + 1) * CELL);

  const y = -(meta.row * CELL);

  const style = {
    backgroundImage: `url(/Chomb3.png)`,
    backgroundPosition: `${fromX}px ${y}px`,
    transform: `scale(${scale})`,
    animationName: styles.boomiFrames as unknown as string,
    animationDuration: `${durationS}s`,
    animationTimingFunction: `steps(${frameCount})`,
    animationIterationCount: useLoop ? "infinite" : "1",
    animationFillMode: useLoop ? "none" : "forwards",

    "--fromX": `${fromX}px`,
    "--toX": `${toX}px`,
    "--y": `${y}px`,
  } satisfies CSSVars;

  return (
    <div
      className={[styles.wrap, className].filter(Boolean).join(" ")}
      aria-label={`Boomi ${anim}`}>
      <div
        className={styles.sprite}
        style={style}
        onAnimationEnd={() => {
          if (!useLoop) onDone?.();
        }}
      />
    </div>
  );
};
