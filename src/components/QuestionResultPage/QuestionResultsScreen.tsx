import React, { useCallback, useState } from "react";
import { GameHeader } from "../../layout/GameHeader/GameHeader";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { Typewriter } from "../../layout/Typewriter/Typewriter";
import type { Player, Room } from "../../types/game";
import { GameTimer } from "../GamePage/GameTimer";
import styles from "./QuestionResultsScreen.module.css";

interface QuestionResultsScreenProps {
  room: Room;
  onLeave: () => void;
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
  onLeave,
  onContinue,
  hasAnyVotes,
  error,
  topCivilianTarget,
  topImposterTarget,
  isCurrentCivilianTop,
  isCurrentImposterTop,
  civilianQuestionText,
}) => {
  const [view, setView] = useState<"civilian" | "imposter">("civilian");

  const shownQuestionText =
    view === "civilian"
      ? civilianQuestionText
      : "A secret Boomi assignment was made!";

  let titleText = `Round ${room.round} – results`;
  let playerNameToShow: string | null = null;

  if (!error && hasAnyVotes) {
    if (view === "civilian") {
      if (isCurrentCivilianTop) {
        titleText = "You got the most votes!";
      } else if (topCivilianTarget) {
        titleText = "The player with most votes:";
        playerNameToShow = topCivilianTarget.name;
      }
    } else {
      if (isCurrentImposterTop) {
        titleText = "You got Boomi!";
      } else if (topImposterTarget) {
        titleText = "The player that got Boomi was:";
        playerNameToShow = topImposterTarget.name;
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

  const questionTypingKey = `${timerKey}-question`;
  const titleTypingKey = `${timerKey}-title`;
  const nameTypingKey = `${timerKey}-name`;
  const errorTypingKey = `${timerKey}-error`;
  const extraTypingKey = `${timerKey}-extra`;

  return (
    <main className={styles.main}>
      <GameHeader
        onLeave={onLeave}
        center={
          <GameTimer
            key={timerKey}
            durationSeconds={10000}
            onTimeout={handleTimerTimeout}
          />
        }
      />

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <div className={styles.frameBody}>
              {!!shownQuestionText && (
                <p
                  className={`text-subtitle ${styles.title}`}
                  style={{ marginBottom: 10 }}>
                  <Typewriter
                    key={questionTypingKey}
                    text={shownQuestionText}
                    speedMs={38}
                    startDelayMs={50}
                  />
                </p>
              )}

              <h1 className={`text-body-black ${styles.title}`}>
                <Typewriter
                  key={titleTypingKey}
                  text={titleText}
                  speedMs={108}
                  startDelayMs={250}
                />
              </h1>

              {playerNameToShow && (
                <h2 className={`text-subtitle ${styles.playerName}`}>
                  <Typewriter
                    key={nameTypingKey}
                    text={playerNameToShow}
                    speedMs={30}
                    startDelayMs={500}
                  />
                </h2>
              )}

              {error && (
                <p className={styles.errorText}>
                  <Typewriter
                    key={errorTypingKey}
                    text={`"${error}"`}
                    speedMs={36}
                    startDelayMs={150}
                  />
                </p>
              )}

              {!error && !hasAnyVotes && (
                <h3 className={styles.extraMessage}>
                  <Typewriter
                    key={extraTypingKey}
                    text="No votes this round."
                    speedMs={38}
                    startDelayMs={300}
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
                        startDelayMs={300}
                      />
                    </h3>
                  )}

                  {view === "imposter" && !topImposterTarget && (
                    <h3 className={styles.extraMessage}>
                      <Typewriter
                        key={`${timerKey}-extra-imp`}
                        text="No imposter votes were cast this round."
                        speedMs={38}
                        startDelayMs={300}
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
