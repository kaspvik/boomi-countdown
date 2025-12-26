// QuestionResultsScreen.tsx
import React, { useCallback, useState } from "react";
import { GameHeader } from "../../layout/GameHeader/GameHeader";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
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
  imposterQuestionText,
  isViewerImposter,
}) => {
  const [view, setView] = useState<"civilian" | "imposter">("civilian");

  const shownQuestionText =
    view === "civilian"
      ? civilianQuestionText
      : isViewerImposter
      ? imposterQuestionText
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

  return (
    <main className={styles.main}>
      <GameHeader
        onLeave={onLeave}
        center={
          <GameTimer
            key={timerKey}
            durationSeconds={10}
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
                  {shownQuestionText}
                </p>
              )}

              <h1 className={`text-body-black ${styles.title}`}>{titleText}</h1>

              {playerNameToShow && (
                <h2 className={`text-subtitle ${styles.playerName}`}>
                  {playerNameToShow}
                </h2>
              )}

              {error && <p className={styles.errorText}>&quot;{error}&quot;</p>}

              {!error && !hasAnyVotes && (
                <h3 className={styles.extraMessage}>No votes this round.</h3>
              )}

              {!error && hasAnyVotes && (
                <>
                  {view === "civilian" && !topCivilianTarget && (
                    <h3 className={styles.extraMessage}>
                      No civilian votes were cast this round.
                    </h3>
                  )}

                  {view === "imposter" && !topImposterTarget && (
                    <h3 className={styles.extraMessage}>
                      No imposter votes were cast this round.
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
