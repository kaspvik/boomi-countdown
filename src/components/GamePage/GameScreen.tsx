import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import type { Player } from "../../types/game";
import { CardPanel } from "../CardPanel/CardPanel";
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

  canUsePassCard: boolean;
  isPassPanelOpen: boolean;
  passTargets: Player[];
  selectedPassTargetId: string | null;
  onOpenPassPanel: () => void;
  onCancelPassPanel: () => void;
  onSelectPassTarget: (id: string) => void;
  onConfirmPassTarget: () => void;

  canUseBlockCard: boolean;
  onUseBlockCard: () => void;
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
  canUsePassCard,
  isPassPanelOpen,
  passTargets,
  selectedPassTargetId,
  onOpenPassPanel,
  onCancelPassPanel,
  onSelectPassTarget,
  onConfirmPassTarget,
  canUseBlockCard,
  onUseBlockCard,
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

          {isAlive && !isGuessOpen && isPassPanelOpen && (
            <PixelFrame>
              <CardPanel
                targets={passTargets}
                selectedTargetId={selectedPassTargetId}
                onSelectTarget={onSelectPassTarget}
                onConfirm={onConfirmPassTarget}
                onCancel={onCancelPassPanel}
                canUsePassCard={canUsePassCard}
                canUseBlockCard={canUseBlockCard}
                onUseBlockCard={onUseBlockCard}
              />
            </PixelFrame>
          )}
        </div>
      </section>

      <section className={styles.bottomBar}>
        {isAlive ? (
          <>
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

            <PixelButton
              className="text-button"
              onClick={() =>
                isPassPanelOpen ? onCancelPassPanel() : onOpenPassPanel()
              }
              disabled={
                !isPassPanelOpen &&
                (isGuessOpen || (!canUsePassCard && !canUseBlockCard))
              }>
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
