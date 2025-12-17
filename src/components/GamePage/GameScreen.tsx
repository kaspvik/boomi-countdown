import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { Table } from "../../layout/Table/Table";
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

  isPassPanelOpen: boolean;
  onOpenPassPanel: () => void;
  onCancelPassPanel: () => void;
  canOpenCardsButton: boolean;

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
  isGuessOpen,
  guessTargets,
  selectedGuessTargetId,
  onSelectGuessTarget,
  onOpenGuess,
  onCancelGuess,
  onConfirmGuess,
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
          {showInfoBox &&
            bombHolderName &&
            !(isPassPanelOpen && !isCurrentHolder) && (
              <PixelFrame>
                <div className={styles.header}>
                  <p className="text-subtitle">
                    Current bomb holder: <br />
                    {bombHolderName}
                  </p>
                </div>
              </PixelFrame>
            )}

          {isCurrentHolder && isAlive && isGuessOpen && (
            <GuessPanel
              targets={guessTargets}
              selectedTargetId={selectedGuessTargetId}
              onSelectTarget={onSelectGuessTarget}
              onConfirm={onConfirmGuess}
              onCancel={onCancelGuess}
            />
          )}

          {isAlive && !isGuessOpen && isPassPanelOpen && cardPanel}
        </div>
      </section>

      <section className={styles.bottomBar}>
        <div className={styles.tableBg} aria-hidden="true">
          <Table />
        </div>

        <div className={styles.left}>
          {isAlive && isCurrentHolder ? (
            <PixelButton
              onClick={onOpenGuess}
              className="text-button"
              disabled={isGuessOpen || isPassPanelOpen}>
              Guess
            </PixelButton>
          ) : null}
        </div>

        <div className={styles.center} />

        <div className={styles.right}>
          {isAlive ? (
            <PixelButton
              className="text-button"
              onClick={() =>
                isPassPanelOpen ? onCancelPassPanel() : onOpenPassPanel()
              }
              disabled={!canOpenCardsButton || isGuessOpen}>
              {isPassPanelOpen ? "Go back" : "Cards"}
            </PixelButton>
          ) : null}
        </div>
      </section>
    </main>
  );
};
