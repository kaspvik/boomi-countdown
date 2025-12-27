import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { Typewriter } from "../../layout/Typewriter/Typewriter";
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
  // ✅ En stabil key som ändras när "vyn" byts
  // (räcker ofta med step + hasRoleReveal + relevant title)
  const typingKey = hasRoleReveal
    ? `step-${step}-reveal-${roleTitleText ?? "none"}`
    : `step-${step}-normal-${titleText}`;

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
                  <h1 className={`text-title ${styles.title}`}>
                    <Typewriter
                      key={`${typingKey}-title`}
                      text={titleText}
                      speedMs={45}
                      startDelayMs={80}
                    />
                  </h1>

                  <h2 className={`text-body ${styles.message}`}>
                    <Typewriter
                      key={`${typingKey}-msg`}
                      text={messageText}
                      speedMs={22}
                      startDelayMs={280}
                    />
                  </h2>
                </>
              )}

              {step === 1 && hasRoleReveal && roleTitleText && (
                <>
                  <h1 className={`text-title ${styles.title}`}>
                    <Typewriter
                      key={`${typingKey}-role-title`}
                      text={roleTitleText}
                      speedMs={45}
                      startDelayMs={80}
                    />
                  </h1>

                  {roleMessageText && (
                    <h2 className={`text-body ${styles.message}`}>
                      <Typewriter
                        key={`${typingKey}-role-msg`}
                        text={roleMessageText}
                        speedMs={22}
                        startDelayMs={280}
                      />
                    </h2>
                  )}
                </>
              )}

              {step === 1 && !hasRoleReveal && (
                <>
                  <p className={`text-title ${styles.title}`}>
                    <Typewriter
                      key={`${typingKey}-plain-title`}
                      text={titleText}
                      speedMs={45}
                      startDelayMs={80}
                    />
                  </p>

                  <p className={`text-body ${styles.message}`}>
                    <Typewriter
                      key={`${typingKey}-plain-msg`}
                      text={messageText}
                      speedMs={22}
                      startDelayMs={280}
                    />
                  </p>
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
