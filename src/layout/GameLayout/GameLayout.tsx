import React from "react";
import { RoomEffectsLayer } from "../RoomEffects/RoomEffectsLayer";
import styles from "./GameLayout.module.css";

interface GameLayoutProps {
  children: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  return (
    <div className={styles.outside}>
      <div className={styles.greenhouse}>
        <div className={styles.content}>{children}</div>
      </div>
      <RoomEffectsLayer />
    </div>
  );
};
