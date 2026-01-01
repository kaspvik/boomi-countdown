import React from "react";
import styles from "./GameLogo.module.css";

type GameLogoVariant = "hero" | "header";

interface GameLogoProps {
  variant?: GameLogoVariant;
}

export const GameLogo: React.FC<GameLogoProps> = ({ variant = "hero" }) => {
  if (variant === "header") {
    return (
      <h1 className={styles.title}>
        BOOMI <span className={styles.subTitle}>COUNTDOWN</span>
      </h1>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <h1 className={styles.title}>
          BOOMI <span className={styles.subTitle}>COUNTDOWN</span>
        </h1>
      </div>
    </div>
  );
};
