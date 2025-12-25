import React, { useCallback, useEffect, useRef, useState } from "react";
import { GameHeader } from "../../layout/GameHeader/GameHeader";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { Table } from "../../layout/Table/Table";
import { useGameStore } from "../../store/gameStore";
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

  const setDim = useGameStore((s) => s.setDim);
  const setSpotlight = useGameStore((s) => s.setSpotlight);
  const setFlicker = useGameStore((s) => s.setFlicker);
  const resetRoomFx = useGameStore((s) => s.resetRoomFx);

  const spotlightTimerRef = useRef<number | null>(null);

  const secondsLeftRef = useRef<number>(durationSeconds);

  useEffect(() => {
    secondsLeftRef.current = durationSeconds;
    setFlicker(0);
  }, [timerKey, durationSeconds, setFlicker]);

  const boomiOnTable = isAlive && isCurrentHolder;

  const handleTick = useCallback(
    (sLeft: number) => {
      secondsLeftRef.current = sLeft;
      onTimerTick(sLeft);

      if (!boomiOnTable) {
        setFlicker(0);
        return;
      }

      const intensity = sLeft <= 3 ? 1 : sLeft <= 10 ? 0.75 : 0;
      setFlicker(intensity);
    },
    [boomiOnTable, onTimerTick, setFlicker]
  );

  useEffect(() => {
    if (spotlightTimerRef.current) {
      window.clearTimeout(spotlightTimerRef.current);
      spotlightTimerRef.current = null;
    }

    if (!boomiOnTable) {
      resetRoomFx();
      return;
    }

    const baseDim =
      boomiAnim === "explode" ? 0.85 : boomiAnim === "tick" ? 0.7 : 0.6;

    setDim(baseDim);
    setSpotlight({
      enabled: false,
      x: 50,
      y: 84,
      sizePx: boomiAnim === "explode" ? 220 : boomiAnim === "tick" ? 260 : 280,
      strength: 1,
    });

    const delayMs = 180;
    spotlightTimerRef.current = window.setTimeout(() => {
      setSpotlight({ enabled: true });
    }, delayMs);

    return () => {
      if (spotlightTimerRef.current) {
        window.clearTimeout(spotlightTimerRef.current);
        spotlightTimerRef.current = null;
      }
      resetRoomFx();
    };
  }, [boomiOnTable, boomiAnim, resetRoomFx, setDim, setSpotlight]);

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
        className={styles.uiAboveFx}
        onLeave={onLeave}
        center={
          <GameTimer
            key={timerKey}
            durationSeconds={durationSeconds}
            onTimeout={onTimeout}
            onTick={handleTick}
          />
        }
      />

      <section className={`${styles.content} ${styles.uiAboveFx}`}>
        <div className={styles.contentInner}>
          {showInfoBox &&
            bombHolderName &&
            !(isPassPanelOpen && !isCurrentHolder) && (
              <PixelFrame>
                <div className={styles.header}>
                  <h1 className="text-subtitle">
                    Current Boomi holder: <br />
                    <span className="text-game">{bombHolderName}</span>
                  </h1>
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
        <div
          className={`${styles.tableBg} ${styles.worldBelowFx}`}
          aria-hidden="true">
          <Table />
        </div>

        {isAlive && isCurrentHolder ? (
          <div
            className={`${styles.boomiLayer} ${styles.worldBelowFx}`}
            aria-hidden="true">
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

        <div className={`${styles.left} ${styles.uiAboveFx}`}>
          {isAlive && isCurrentHolder ? (
            <PixelButton
              onClick={onOpenGuess}
              className="text-button"
              disabled={isGuessOpen || isPassPanelOpen}>
              Guess
            </PixelButton>
          ) : null}
        </div>

        <div className={`${styles.center} ${styles.uiAboveFx}`} />

        <div className={`${styles.right} ${styles.uiAboveFx}`}>
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
