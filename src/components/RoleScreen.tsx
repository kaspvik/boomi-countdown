import React from "react";
import styles from "./RoleScreen.module.css";
import { PixelButton } from "./ui/PixelButton";
import { PixelFrame } from "./ui/PixelFrame";

interface RoleScreenProps {
  role: "civilian" | "imposter";
  onContinue: () => void;
}

export const RoleScreen: React.FC<RoleScreenProps> = ({ role, onContinue }) => {
  const isCivilian = role === "civilian";

  return (
    <PixelFrame>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h2 className={styles.titel}>
            {isCivilian ? "You are a CIVILIAN!" : "You are an IMPOSTER!"}
          </h2>

          {isCivilian && (
            <p className="text-body">
              Stay calm, watch the others and try to figure out who is placing
              Boomi. Work together with the other civilians and don&apos;t get
              blown up.
            </p>
          )}

          {!isCivilian && (
            <p className="text-body">
              You are secretly on Boomi&apos;s side. Place the bomb cleverly,
              create chaos and try not to get caught.
            </p>
          )}
        </div>

        <div className={styles.buttonRow}>
          <PixelButton onClick={onContinue} className="text-button">
            Got it!
          </PixelButton>
        </div>
      </div>
    </PixelFrame>
  );
};
