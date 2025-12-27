import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { Typewriter } from "../../layout/Typewriter/Typewriter";
import styles from "./RoundResultsScreen.module.css";

interface RoundResultsScreenProps {
  step: 0 | 1 | 2;

  titleText: string;
  messageText: string;

  roleTitleText: string | null;
  roleMessageText: string | null;
  hasRoleReveal: boolean;

  isHost: boolean;
  primaryButtonLabel: string;
  onPrimaryClick: () => void;
  onLeave: () => void;

  statusTitleText?: string;
  statusMessageText?: string;
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
  statusTitleText,
  statusMessageText,
}) => {
  const typingKey =
    step === 0
      ? `step-0-${titleText}`
      : step === 1
      ? `step-1-${roleTitleText ?? "none"}`
      : `step-2-${statusTitleText ?? "none"}`;

  return (
    <main className={styles.main}>
      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <div className={styles.frameBody}>
              {step === 0 && (
                <>
                  <h1 className={`text-game ${styles.title}`}>
                    <Typewriter
                      key={`${typingKey}-title`}
                      text={titleText}
                      speedMs={45}
                      startDelayMs={80}
                    />
                  </h1>

                  <h2 className={`text-body-black ${styles.message}`}>
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
                  <h1 className={`text-game ${styles.title}`}>
                    <Typewriter
                      key={`${typingKey}-role-title`}
                      text={roleTitleText}
                      speedMs={45}
                      startDelayMs={80}
                    />
                  </h1>

                  {roleMessageText && (
                    <h2 className={`text-body-black ${styles.message}`}>
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
                  <p className={`text-game ${styles.title}`}>
                    <Typewriter
                      key={`${typingKey}-plain-title`}
                      text={titleText}
                      speedMs={45}
                      startDelayMs={80}
                    />
                  </p>

                  <p className={`text-body-black ${styles.message}`}>
                    <Typewriter
                      key={`${typingKey}-plain-msg`}
                      text={messageText}
                      speedMs={22}
                      startDelayMs={280}
                    />
                  </p>
                </>
              )}

              {step === 2 && (
                <>
                  <h1 className={`text-game ${styles.title}`}>
                    <Typewriter
                      key={`${typingKey}-status-title`}
                      text={statusTitleText ?? ""}
                      speedMs={45}
                      startDelayMs={80}
                    />
                  </h1>

                  <h2 className={`text-body-black ${styles.message}`}>
                    <Typewriter
                      key={`${typingKey}-status-msg`}
                      text={statusMessageText ?? ""}
                      speedMs={22}
                      startDelayMs={280}
                    />
                  </h2>
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
