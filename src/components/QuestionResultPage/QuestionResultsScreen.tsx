import React, { useCallback, useState } from "react";
import { GameHeader } from "../../layout/GameHeader/GameHeader";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { Typewriter } from "../../layout/Typewriter/Typewriter";
import type { Player, Room } from "../../types/game";
import styles from "./QuestionResultsScreen.module.css";

interface QuestionResultsScreenProps {
  room: Room;
  onContinue: () => void;
  hasAnyVotes: boolean;
  error: string | null;
  topCivilianTarget: Player | null;
  topImposterTarget: Player | null;
  isCurrentCivilianTop: boolean;
  isCurrentImposterTop: boolean;

  civilianQuestionText: string;
  imposterQuestionText: string;

  isViewerImposter: boolean;
}

export const QuestionResultsScreen: React.FC<QuestionResultsScreenProps> = ({
  room,
  onContinue,
  hasAnyVotes,
  error,
  topCivilianTarget,
  topImposterTarget,
  isCurrentCivilianTop,
  isCurrentImposterTop,
}) => {
  const [view, setView] = useState<"civilian" | "imposter">("civilian");

  let titlePrefix = `Round ${room.round} – results`;
  let titleName: string | null = null;

  if (!error && hasAnyVotes) {
    if (view === "civilian") {
      if (isCurrentCivilianTop) {
        const name = topCivilianTarget?.name ?? "Player";
        titlePrefix = "You got the most votes";
        titleName = name;
      } else if (topCivilianTarget) {
        titlePrefix = "The player with most votes was";
        titleName = topCivilianTarget.name;
      }
    } else {
      if (isCurrentImposterTop) {
        const name = topImposterTarget?.name ?? "Player";
        titlePrefix = "You got Boomi";
        titleName = name;
      } else if (topImposterTarget) {
        titlePrefix = "The player that got Boomi was";
        titleName = topImposterTarget.name;
      }
    }
  }

  const [timerStep, setTimerStep] = useState(0);

  const handleTimerTimeout = useCallback(() => {
    if (view === "civilian") {
      setView("imposter");
      setTimerStep((prev) => prev + 1);
      return;
    }

    if (view === "imposter") {
      onContinue();
    }
  }, [view, onContinue]);

  const timerKey = `${room.round}-${view}-${timerStep}`;

  const titleNameKey = `${timerKey}-title-name`;
  const errorTypingKey = `${timerKey}-error`;
  const extraTypingKey = `${timerKey}-extra`;

  return (
    <main className={styles.main}>
      <div className={styles.headerSlide}>
        <GameHeader
          onLeave={onLeave}
          center={
            <GameTimer
              key={timerKey}
              mode="local"
              durationSeconds={10}
              onTimeout={handleTimerTimeout}
            />
          }
        />
      </div>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <div className={styles.frameBody}>
              <h2 className={`text-game ${styles.title}`}>
                {titlePrefix}

                {titleName && (
                  <>
                    <br />
                    <strong>
                      <Typewriter
                        key={titleNameKey}
                        text={`${titleName}!`}
                        speedMs={30}
                        startDelayMs={950}
                      />
                    </strong>
                  </>
                )}
              </h2>

              {error && (
                <h3 className={styles.errorText}>
                  <Typewriter
                    key={errorTypingKey}
                    text={`"${error}"`}
                    speedMs={36}
                    startDelayMs={150}
                  />
                </h3>
              )}

              {!error && !hasAnyVotes && (
                <h3 className={styles.extraMessage}>
                  <Typewriter
                    key={extraTypingKey}
                    text="No votes this round."
                    speedMs={38}
                    startDelayMs={250}
                  />
                </h3>
              )}

              {!error && hasAnyVotes && (
                <>
                  {view === "civilian" && !topCivilianTarget && (
                    <h3 className={styles.extraMessage}>
                      <Typewriter
                        key={`${timerKey}-extra-civ`}
                        text="No civilian votes were cast this round."
                        speedMs={38}
                        startDelayMs={250}
                      />
                    </h3>
                  )}

                  {view === "imposter" && !topImposterTarget && (
                    <h3 className={styles.extraMessage}>
                      <Typewriter
                        key={`${timerKey}-extra-imp`}
                        text="No imposter votes were cast this round."
                        speedMs={38}
                        startDelayMs={250}
                      />
                    </h3>
                  )}
                </>
              )}
            </div>
          </PixelFrame>
        </div>
      </section>
    </main>
  );
};
