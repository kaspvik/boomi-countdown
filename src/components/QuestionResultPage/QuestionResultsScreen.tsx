import { useRoundVotes } from "../../firestore-hooks/useRoundVotes";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { getTopVotedPlayerForRole } from "../../services/voteHelpers";
import type { Player, Room } from "../../types/game";
import styles from "../QuestionPage/QuestionScreen.module.css";

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
  isHost,
  onLeave,
  onContinue,
}) => {
  const { votes, error } = useRoundVotes(roomId, room.round);

  const { player: topCivilianTarget, count: civilianCount } =
    getTopVotedPlayerForRole(votes, players, "civilian");

  return (
    <main className={styles.main}>
      <section className={styles.topBar}>
        <div className={styles.leaveButton}>
          <PixelButton onClick={onLeave} className="text-button">
            Leave game
          </PixelButton>
        </div>

        <div className={styles.timer}>
          <p className="text-subtitle">Voting results</p>
        </div>

        <div className={styles.emptyBlock} />
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <p className="text-title">Round {room.round} – results</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {!error && votes.length === 0 && (
              <p className="text-subtitle">No votes yet this round.</p>
            )}

            {!error && votes.length > 0 && (
              <div style={{ marginTop: "0.75rem" }}>
                <p className="text-subtitle">CIVILIANS voted:</p>

                {topCivilianTarget ? (
                  <p className="text-body">
                    Most suspected: <strong>{topCivilianTarget.name}</strong> (
                    {civilianCount} votes)
                  </p>
                ) : (
                  <p className="text-body">
                    No civilian votes were cast this round.
                  </p>
                )}
              </div>
            )}

            {isHost && (
              <div style={{ marginTop: "1.25rem" }}>
                <PixelButton onClick={onContinue} className="text-button">
                  Continue to round
                </PixelButton>
              </div>
            )}
          </PixelFrame>
        </div>
      </section>
    </main>
  );
};
