import React, { useCallback, useState } from "react";
import { GameHeader } from "../../layout/GameHeader/GameHeader";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { Table } from "../../layout/Table/Table";
import type { Player } from "../../types/game";
import { BoomiCanvas } from "../Boomi/BoomiCanvas";
import styles from "../GamePage/GameScreen.module.css";
import { GameTimer } from "./GameTimer";
import { GuessPanel } from "./GuessPanel";

interface GameScreenProps {
  timerKey: string;
  durationSeconds: number;
  onTimeout: () => void;

  onTimerTick: (secondsLeft: number) => void;

  onLeave: () => void;

  showInfoBox: boolean;
  bombHolderName: string | null;

  isCurrentHolder: boolean;
  isAlive: boolean;

  boomiAnim: "idle" | "tick" | "pass" | "explode";
  boomiAnimKey: string;
  onBoomiExplodeComplete?: () => void;

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

  cardPanel: (helpers: {
    requestBoomiExit: (afterExit: () => void) => void;
  }) => React.ReactNode;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  timerKey,
  durationSeconds,
  onTimeout,
  onTimerTick,
  onLeave,
  showInfoBox,
  bombHolderName,
  isCurrentHolder,
  isAlive,
  boomiAnim,
  boomiAnimKey,
  onBoomiExplodeComplete,
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
  const [boomiExitKey, setBoomiExitKey] = useState<string | undefined>(
    undefined
  );

  const [, setAfterExitAction] = useState<null | (() => void)>(null);

  const requestBoomiExit = useCallback(
    (afterExit: () => void) => {
      if (!isAlive || !isCurrentHolder) {
        afterExit();
        return;
      }

      if (boomiExitKey) return;

      setAfterExitAction(() => afterExit);

      setBoomiExitKey(`${Date.now()}-${Math.random()}`);
    },
    [isAlive, isCurrentHolder, boomiExitKey]
  );

  const handleBoomiExitComplete = useCallback(() => {
    setAfterExitAction((fn) => {
      fn?.();
      return null;
    });

    setBoomiExitKey(undefined);
  }, []);

  return (
    <main className={styles.main}>
      <GameHeader
        onLeave={onLeave}
        center={
          <GameTimer
            key={timerKey}
            durationSeconds={durationSeconds}
            onTimeout={onTimeout}
            onTick={onTimerTick}
          />
        }
      />

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
              onConfirm={() => requestBoomiExit(onConfirmGuess)}
              onCancel={onCancelGuess}
            />
          )}

          {isAlive &&
            !isGuessOpen &&
            isPassPanelOpen &&
            cardPanel({ requestBoomiExit })}
        </div>
      </section>

      <section className={styles.bottomBar}>
        <div className={styles.tableBg} aria-hidden="true">
          <Table />
        </div>

        {isAlive && isCurrentHolder ? (
          <div className={styles.boomiLayer} aria-hidden="true">
            <BoomiCanvas
              visibleKey={bombHolderName ?? "none"}
              anim={boomiAnim}
              animKey={boomiAnimKey}
              exitKey={boomiExitKey}
              onExitComplete={handleBoomiExitComplete}
              onExplodeComplete={onBoomiExplodeComplete}
            />
          </div>
        ) : null}

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
