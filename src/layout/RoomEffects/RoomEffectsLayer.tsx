import React from "react";
import { useGameStore } from "../../store/gameStore";
import styles from "./RoomEffectsLayer.module.css";

type CSSVars = React.CSSProperties & {
  "--fx-dim"?: string;
  "--fx-spot-x"?: string;
  "--fx-spot-y"?: string;
  "--fx-spot-size"?: string;
  "--fx-spot-strength"?: string;
  "--fx-flicker"?: string;
};

export const RoomEffectsLayer: React.FC = () => {
  const dim = useGameStore((s) => s.roomFx.dim);
  const spotlight = useGameStore((s) => s.roomFx.spotlight);
  const flicker = useGameStore((s) => s.roomFx.flicker);

  const mode: "off" | "dim" | "spotlight" = spotlight.enabled
    ? "spotlight"
    : dim > 0
    ? "dim"
    : "off";

  const style: CSSVars = {
    "--fx-dim": String(dim),
    "--fx-spot-x": `${spotlight.x}%`,
    "--fx-spot-y": `${spotlight.y}%`,
    "--fx-spot-size": `${spotlight.sizePx}px`,
    "--fx-spot-strength": String(spotlight.strength),
    "--fx-flicker": String(flicker),
  };

  return (
    <div
      className={styles.overlay}
      aria-hidden="true"
      data-mode={mode}
      data-flicker={flicker > 0 ? "on" : "off"}
      style={style}
    />
  );
};
