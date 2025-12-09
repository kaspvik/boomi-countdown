import { useMemo, useState } from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { submitVote } from "../../services/submitVote";
import type { Player } from "../../types/game";
import styles from "./QuestionForm.module.css";

interface QuestionFormProps {
  roomId: string;
  round: number;
  currentPlayer: Player;
  players: Player[];
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  roomId,
  round,
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

  const descriptionText =
    "Everyone votes at the same time. Civilians discuss and suspect, imposters secretly choose who should get Boomi.";

  const possibleTargets = useMemo(
    () => players.filter((p) => p.alive !== false && p.id !== currentPlayer.id),
    [players, currentPlayer.id]
  );

  const handleSubmit = async () => {
    if (!selectedTargetId || isSubmitting || hasVoted) return;

    setIsSubmitting(true);
    try {
      await submitVote(
        roomId,
        round,
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

  return (
    <div className={styles.wrapper}>
      <p className="text-title">{questionText}</p>
      <p className="text-body">{descriptionText}</p>

      <label className="text-subtitle">
        Choose a player:
        <select
          className={styles.select}
          value={selectedTargetId}
          onChange={(e) => setSelectedTargetId(e.target.value)}
          disabled={hasVoted || isSubmitting}>
          <option value="">Select...</option>
          {possibleTargets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
              {p.isHost ? " (host)" : ""}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.buttonRow}>
        <PixelButton
          onClick={handleSubmit}
          className="text-button"
          disabled={!selectedTargetId || hasVoted || isSubmitting}>
          {hasVoted ? "Vote submitted" : "Submit vote"}
        </PixelButton>
      </div>

      {hasVoted && (
        <p className="text-subtitle">
          Your vote has been saved. Wait for the round to start.
        </p>
      )}
    </div>
  );
};
