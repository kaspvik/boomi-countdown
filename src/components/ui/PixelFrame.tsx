import React from "react";
import styles from "./PixelFrame.module.css";

interface PixelFrameProps {
  children: React.ReactNode;
}

export const PixelFrame: React.FC<PixelFrameProps> = ({ children }) => {
  return (
    <section className={styles.pixelFrame}>
      <div className={styles.content}>{children}</div>
    </section>
  );
};
