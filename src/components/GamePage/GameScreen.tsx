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

  // Guess
  isGuessOpen: boolean;
  guessTargets: Player[];
  selectedGuessTargetId: string | null;
  onSelectGuessTarget: (id: string) => void;
  onOpenGuess: () => void;
  onCancelGuess: () => void;
  onConfirmGuess: () => void;

  // Cards (panel state)
  isPassPanelOpen: boolean;
  onOpenPassPanel: () => void;
  onCancelPassPanel: () => void;
  canOpenCardsButton: boolean;

  // Card panel content
  cardPanel: React.ReactNode;
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
  // Guess
  isGuessOpen,
  guessTargets,
  selectedGuessTargetId,
  onSelectGuessTarget,
  onOpenGuess,
  onCancelGuess,
  onConfirmGuess,
  // Cards
  isPassPanelOpen,
  onOpenPassPanel,
  onCancelPassPanel,
  canOpenCardsButton,
  cardPanel,
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
                <p className="text-title">
                  Current bomb holder: <br /> {bombHolderName}
                </p>
              </div>
            </PixelFrame>
          )}

          {/* Guess-panel: bara bomb-holder */}
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

          {/* Card panel content (Pass on + Block) */}
          {isAlive && !isGuessOpen && isPassPanelOpen && cardPanel}
        </div>
      </section>

      <section className={styles.bottomBar}>
        {isAlive ? (
          <>
            {/* Left: Guess only for bomb-holder */}
            {isCurrentHolder ? (
              <PixelButton
                onClick={onOpenGuess}
                className="text-button"
                disabled={isGuessOpen || isPassPanelOpen}>
                Guess
              </PixelButton>
            ) : (
              <div />
            )}

            <p>*BORDET*</p>

            {/* Right: Cards for all alive players */}
            <PixelButton
              className="text-button"
              onClick={() =>
                isPassPanelOpen ? onCancelPassPanel() : onOpenPassPanel()
              }
              disabled={!canOpenCardsButton || isGuessOpen}>
              {isPassPanelOpen ? "Go back" : "Cards"}
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
