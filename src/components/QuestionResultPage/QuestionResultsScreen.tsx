import { useCallback, useState } from "react";
import { useRoundVotes } from "../../firestore-hooks/useRoundVotes";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { getTopVotedPlayerForRole } from "../../services/voteHelpers";
import type { Player, Room } from "../../types/game";
import { GameTimer } from "../GamePage/GameTimer";
import styles from "./QuestionResultsScreen.module.css";

interface QuestionResultsScreenProps {
  room: Room;
  roomId: string;
  players: Player[];
  isHost: boolean;
  onLeave: () => void;
  onContinue: () => void;
}

export const QuestionResultsScreen: React.FC<QuestionResultsScreenProps> = ({
  room,
  roomId,
  players,
  onLeave,
  onContinue,
}) => {
  const { votes, error } = useRoundVotes(roomId, room.round);

  const { player: topCivilianTarget, count: civilianCount } =
    getTopVotedPlayerForRole(votes, players, "civilian");

  const { player: topImposterTarget, count: imposterCount } =
    getTopVotedPlayerForRole(votes, players, "imposter");

  const [view, setView] = useState<"civilian" | "imposter">("civilian");

  const hasAnyVotes = votes.length > 0;

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
      <section className={styles.topBar}>
        <div className={styles.leaveButton}>
          <PixelButton onClick={onLeave} className="text-button">
            Leave game
          </PixelButton>
        </div>

        <div className={styles.timer}>
          <GameTimer
            key={timerKey}
            durationSeconds={10}
            onTimeout={handleTimerTimeout}
          />
        </div>

        <div className={styles.emptyBlock} />
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <p className="text-title">
              Round {room.round} –{" "}
              {view === "civilian" ? "civilians voted" : "imposters chose"}
            </p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!error && !hasAnyVotes && (
              <p className="text-subtitle">No votes this round.</p>
            )}

            {!error && hasAnyVotes && (
              <>
                {view === "civilian" && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <p className="text-subtitle">CIVILIANS voted:</p>

                    {topCivilianTarget ? (
                      <p className="text-body">
                        Most suspected:{" "}
                        <strong>{topCivilianTarget.name}</strong> (
                        {civilianCount} votes)
                      </p>
                    ) : (
                      <p className="text-body">
                        No civilian votes were cast this round.
                      </p>
                    )}
                  </div>
                )}

                {view === "imposter" && (
                  <div style={{ marginTop: "0.75rem" }}>
                    <p className="text-subtitle">IMPOSTERS chose:</p>

                    {topImposterTarget ? (
                      <p className="text-body">
                        Target for Boomi:{" "}
                        <strong>{topImposterTarget.name}</strong> (
                        {imposterCount} votes)
                      </p>
                    ) : (
                      <p className="text-body">
                        No imposter votes were cast this round.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </PixelFrame>
        </div>
      </section>
    </main>
  );
};
