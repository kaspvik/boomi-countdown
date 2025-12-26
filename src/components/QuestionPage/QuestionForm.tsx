import { useEffect, useMemo, useState } from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { submitVote } from "../../services/voting/submitVote";
import type { Player } from "../../types/game";
import styles from "./QuestionForm.module.css";

interface QuestionFormProps {
  roomId: string;
  round: number;
  players: Player[];
  currentPlayer: Player;
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

  const isAlive = currentPlayer.alive !== false;
  const canVote = isAlive;

  useEffect(() => {
    setSelectedTargetId("");
    setHasVoted(false);
    setIsSubmitting(false);
  }, [roomId, round, currentPlayer.id]);

  const isImposter = currentPlayer.role === "imposter";

  const questionText = isImposter
    ? "Choose who should secretly receive Boomi this round."
    : "Who do you suspect the most this round?";

  const possibleTargets = useMemo(() => {
    return players
      .filter((p) => p.alive !== false && p.id !== currentPlayer.id)
      .filter((p) => (isImposter ? p.role !== "imposter" : true));
  }, [players, currentPlayer.id, isImposter]);

  const handleSelectPlayer = (playerId: string) => {
    if (!canVote || hasVoted || isSubmitting) return;
    setSelectedTargetId(playerId);
  };

  const handleSubmit = async () => {
    if (!canVote || !selectedTargetId || isSubmitting || hasVoted) return;

    if (isImposter) {
      const target = players.find((p) => p.id === selectedTargetId);
      if (target?.role === "imposter") {
        console.warn(
          "Imposter cannot target another imposter for bomb receive."
        );
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await submitVote({
        roomId,
        round,
        voterId: currentPlayer.id,
        targetPlayerId: selectedTargetId,
        roleAtTime: isImposter ? "imposter" : "civilian",
      });
      setHasVoted(true);
    } catch (err) {
      console.error("Failed to submit vote", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!canVote) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.questionBox}>
          <h1 className="text-subtitle">You’ve been eliminated</h1>
          <h2 className="text-body-black">
            You can’t vote anymore. <br /> Wait for the next phase.
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.questionBox}>
        <h1 className="text-subtitle">{questionText}</h1>
      </div>

      <h2 className="text-body">Tap the player you want to vote for:</h2>

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
                disabled={!canVote || hasVoted || isSubmitting}>
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
          disabled={!canVote || !selectedTargetId || hasVoted || isSubmitting}>
          {hasVoted ? "Vote submitted" : "Submit vote"}
        </PixelButton>
      </div>

      {hasVoted && (
        <div className={styles.voteConfirmation}>
          <h3 className="text-body">
            Your vote has been saved. <br /> Wait for the round to start.
          </h3>
        </div>
      )}
    </div>
  );
};
