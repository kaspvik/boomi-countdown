import { useMemo, useState } from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { submitVote } from "../../services/submitVote";
import type { Player } from "../../types/game";
import styles from "./QuestionForm.module.css";

interface QuestionFormProps {
  roomId: string;
  currentPlayer: Player;
  players: Player[];
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  roomId,
  currentPlayer,
  players,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const isImposter = currentPlayer.role === "imposter";

  const questionText = isImposter
    ? "Choose who should secretly receive Boomi this round."
    : "Who do you suspect the most this round?";

  const possibleTargets = useMemo(
    () => players.filter((p) => p.alive !== false && p.id !== currentPlayer.id),
    [players, currentPlayer.id]
  );

  const handleSubmit = async () => {
    if (!selectedTargetId || isSubmitting || hasVoted) return;
    console.log("[QuestionForm] submitting vote for target", selectedTargetId);

    setIsSubmitting(true);
    try {
      await submitVote(
        roomId,
        currentPlayer.id,
        selectedTargetId,
        isImposter ? "imposter" : "civilian"
      );
      setHasVoted(true);
    } catch (err) {
      console.error("Failed to submit vote", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPlayer = (playerId: string) => {
    if (hasVoted || isSubmitting) return;
    setSelectedTargetId(playerId);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.questionBox}>
        <p>{questionText}</p>
      </div>

      <p className="text-subtitle">Tap the player you want to vote for:</p>

      <ul className={styles.playersList}>
        {possibleTargets.map((p) => {
          const isSelected = p.id === selectedTargetId;

          return (
            <li key={p.id}>
              <button
                type="button"
                className={`${styles.playerItem} ${
                  isSelected ? styles.playerItemSelected : ""
                }`}
                onClick={() => handleSelectPlayer(p.id)}
                disabled={hasVoted || isSubmitting}>
                <span className={styles.playerName}>
                  {p.name}
                  {p.isHost ? " (host)" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className={styles.buttonRow}>
        <PixelButton
          onClick={handleSubmit}
          className="text-button"
          disabled={!selectedTargetId || hasVoted || isSubmitting}>
          {hasVoted ? "Vote submitted" : "Submit vote"}
        </PixelButton>
      </div>

      {hasVoted && (
        <div className={styles.voteConfirmation}>
          <p className="text-subtitle">
            Your vote has been saved. <br /> Wait for the round to start.
          </p>
        </div>
      )}
    </div>
  );
};
