// src/components/RoundPage/RoundResultsScreen.tsx
import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import styles from "./RoundResultsScreen.module.css";

interface RoundResultsScreenProps {
  step: 0 | 1;

  titleText: string;
  messageText: string;

  roleTitleText: string | null;
  roleMessageText: string | null;
  hasRoleReveal: boolean;

  isHost: boolean;
  primaryButtonLabel: string;
  onPrimaryClick: () => void;
  onLeave: () => void;
}

export const RoundResultsScreen: React.FC<RoundResultsScreenProps> = ({
  step,
  titleText,
  messageText,
  roleTitleText,
  roleMessageText,
  hasRoleReveal,
  isHost,
  primaryButtonLabel,
  onPrimaryClick,
  onLeave,
}) => {
  return (
    <main className={styles.main}>
      <section className={styles.topBar}>
        <div className={styles.leaveButton}>
          <PixelButton onClick={onLeave} className="text-button">
            Leave game
          </PixelButton>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <div className={styles.frameBody}>
              {step === 0 && (
                <>
                  <h1 className={`text-title ${styles.title}`}>{titleText}</h1>
                  <h2 className={`text-body ${styles.message}`}>
                    {messageText}
                  </h2>
                </>
              )}

              {step === 1 && hasRoleReveal && roleTitleText && (
                <>
                  <h1 className={`text-title ${styles.title}`}>
                    {roleTitleText}
                  </h1>
                  {roleMessageText && (
                    <h2 className={`text-body ${styles.message}`}>
                      {roleMessageText}
                    </h2>
                  )}
                </>
              )}

              {step === 1 && !hasRoleReveal && (
                <>
                  <p className={`text-title ${styles.title}`}>{titleText}</p>
                  <p className={`text-body ${styles.message}`}>{messageText}</p>
                </>
              )}

              {isHost && (
                <div className={styles.buttonRow}>
                  <PixelButton onClick={onPrimaryClick} className="text-button">
                    {primaryButtonLabel}
                  </PixelButton>
                </div>
              )}
            </div>
          </PixelFrame>
        </div>
      </section>
    </main>
  );
};
