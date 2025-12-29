import React, { useCallback, useEffect, useRef, useState } from "react";
import { useBoomiHelloSfx } from "../../hooks/useBoomiHelloSfx";
import { GameHeader } from "../../layout/GameHeader/GameHeader";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { Table } from "../../layout/Table/Table";
import { useGameStore } from "../../store/gameStore";
import { useSoundStore } from "../../store/soundStore";
import type { Player } from "../../types/game";
import { BoomiCanvas } from "../Boomi/BoomiCanvas";
import styles from "../GamePage/GameScreen.module.css";
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

  const fxBoomiFocus = useGameStore((s) => s.fxBoomiFocus);
  const fxReset = useGameStore((s) => s.fxReset);
  const fxSetFlickerBySeconds = useGameStore((s) => s.fxSetFlickerBySeconds);
  const fxClearFlicker = useGameStore((s) => s.fxClearFlicker);

  const fxRedPulseOn = useGameStore((s) => s.fxRedPulseOn);
  const fxRedPulseOff = useGameStore((s) => s.fxRedPulseOff);

  const playBgm = useSoundStore((s) => s.playBgm);
  const stopBgm = useSoundStore((s) => s.stopBgm);

  const playSfx = useSoundStore((s) => s.playSfx);
  const stopSfx = useSoundStore((s) => s.stopSfx);

  const tickStartedRef = useRef(false);

  const boomiOnTable = isAlive && isCurrentHolder;

  useEffect(() => {
    if (!isAlive) {
      if (isGuessOpen) onCancelGuess();
      if (isPassPanelOpen) onCancelPassPanel();
    }
  }, [isAlive, isGuessOpen, isPassPanelOpen, onCancelGuess, onCancelPassPanel]);

  useEffect(() => {
    fxClearFlicker();
  }, [timerKey, fxClearFlicker]);

  useEffect(() => {
    if (!boomiOnTable) {
      fxReset();
      return;
    }

    fxBoomiFocus(boomiAnim);
  }, [boomiOnTable, boomiAnim, fxBoomiFocus, fxReset]);

  useEffect(() => {
    if (boomiOnTable) {
      playBgm("boomi");
    } else {
      stopBgm();
    }
  }, [boomiOnTable, playBgm, stopBgm]);

  useBoomiHelloSfx({
    boomiOnTable,
    visibleKey: bombHolderName ?? "none",
    playOnHolderChange: true,
  });

  useEffect(() => {
    if (boomiOnTable && boomiAnim === "explode") {
      fxRedPulseOn(0.95);
    } else {
      fxRedPulseOff();
    }
  }, [boomiOnTable, boomiAnim, fxRedPulseOn, fxRedPulseOff]);

  useEffect(() => {
    if (boomiOnTable && boomiAnim === "explode") {
      stopSfx("tickdown");
      playSfx("explosion");
    }
  }, [boomiOnTable, boomiAnim, playSfx, stopSfx]);

  useEffect(() => {
    if (!boomiOnTable) {
      tickStartedRef.current = false;
      stopSfx("tickdown");
    }
  }, [boomiOnTable, stopSfx]);

  const handleTick = useCallback(
    (sLeft: number) => {
      onTimerTick(sLeft);
      fxSetFlickerBySeconds(sLeft, boomiOnTable);

      if (!boomiOnTable) return;

      if (sLeft === 10 && !tickStartedRef.current) {
        tickStartedRef.current = true;
        playSfx("tickdown");
      }

      if (sLeft > 10 && tickStartedRef.current) {
        tickStartedRef.current = false;
        stopSfx("tickdown");
      }
    },
    [onTimerTick, fxSetFlickerBySeconds, boomiOnTable, playSfx, stopSfx]
  );

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

  useEffect(() => {
    return () => {
      stopBgm();
      stopSfx("tickdown");
    };
  }, [stopBgm, stopSfx]);

  const hideInfoBoxForAlive = isAlive && isPassPanelOpen && !isCurrentHolder;

  return (
    <main className={styles.main}>
      <GameHeader
        onLeave={onLeave}
        timer={{
          key: timerKey,
          durationSeconds,
          onTimeout,
          onTick: handleTick,
        }}
      />

      <section className={`${styles.content} ${styles.uiAboveFx}`}>
        <div className={styles.contentInner}>
          {showInfoBox && bombHolderName && !hideInfoBoxForAlive && (
            <PixelFrame>
              <div className={styles.header}>
                <h1 className="text-subtitle">
                  Current Boomi holder: <br />
                  <span className="text-game">{bombHolderName}</span>
                </h1>

                {!isAlive && (
                  <p className="text-body-black" style={{ marginTop: 8 }}>
                    Spectator mode — you’ve been eliminated.
                  </p>
                )}
              </div>
            </PixelFrame>
          )}

          {isCurrentHolder && isAlive && isGuessOpen && (
            <GuessPanel
              targets={guessTargets}
              selectedTargetId={selectedGuessTargetId}
              onSelectTarget={onSelectGuessTarget}
              onConfirm={() => requestBoomiExit(onConfirmGuess)}
              handleBack={onCancelGuess}
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
              onClick={() => (isGuessOpen ? onCancelGuess() : onOpenGuess())}
              className="text-button"
              disabled={isPassPanelOpen}>
              {isGuessOpen ? "Go back" : "Guess"}
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
