import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import type { Player } from "../../types/game";
import styles from "../GamePage/GameScreen.module.css";
import { GameTimer } from "./GameTimer";
import { GuessPanel } from "./GuessPanel";

interface GameScreenProps {
  timerKey: string;
  durationSeconds: number;
  onTimeout: () => void;

  onLeave: () => void;

  showInfoBox: boolean;
  bombHolderName: string | null;

  isCurrentHolder: boolean;
  isAlive: boolean;
  isGuessOpen: boolean;
  guessTargets: Player[];
  selectedGuessTargetId: string | null;
  onSelectGuessTarget: (id: string) => void;
  onOpenGuess: () => void;
  onCancelGuess: () => void;
  onConfirmGuess: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  timerKey,
  durationSeconds,
  onTimeout,
  onLeave,
  showInfoBox,
  bombHolderName,
  isCurrentHolder,
  isAlive,
  isGuessOpen,
  guessTargets,
  selectedGuessTargetId,
  onSelectGuessTarget,
  onOpenGuess,
  onCancelGuess,
  onConfirmGuess,
}) => {
  return (
    <main className={styles.main}>
      <section className={styles.topBar}>
        <div className={styles.leaveButton}>
          <PixelButton onClick={onLeave} className="text-button">
            Leave game
          </PixelButton>
        </div>

        <div className={styles.timer}>
          <GameTimer
            key={timerKey}
            durationSeconds={durationSeconds}
            onTimeout={onTimeout}
          />
        </div>

        <div className={styles.emptyBlock} />
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          {showInfoBox && bombHolderName && (
            <PixelFrame>
              <div className={styles.header}>
                <p className="text-subtitle">
                  Current bomb holder: <strong>{bombHolderName}</strong>
                </p>
              </div>
            </PixelFrame>
          )}

          {isCurrentHolder && isAlive && isGuessOpen && (
            <PixelFrame>
              <GuessPanel
                targets={guessTargets}
                selectedTargetId={selectedGuessTargetId}
                onSelectTarget={onSelectGuessTarget}
                onConfirm={onConfirmGuess}
                onCancel={onCancelGuess}
              />
            </PixelFrame>
          )}
        </div>
      </section>

      <section className={styles.bottomBar}>
        {isCurrentHolder && isAlive ? (
          <>
            <PixelButton
              onClick={onOpenGuess}
              className="text-button"
              disabled={isGuessOpen}>
              Guess
            </PixelButton>

            <p>*BORDET*</p>

            <PixelButton className="text-button" disabled>
              Pass Boomi
            </PixelButton>
          </>
        ) : (
          <>
            <div />
            <p>*BORDET*</p>
            <div />
          </>
        )}
      </section>
    </main>
  );
};
