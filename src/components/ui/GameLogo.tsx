import React from "react";
import styles from "./GameLogo.module.css";

export const GameLogo: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.frame}>
        <h1 className={styles.title}>Boomi Countdown</h1>
      </div>
    </div>
  );
};
