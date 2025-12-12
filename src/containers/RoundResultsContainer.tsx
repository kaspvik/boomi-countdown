import React, { useState } from "react";
import { RoundResultsScreen } from "../components/RoundResultsPage/RoundResultsScreen";
import type { Player, Room } from "../types/game";

interface RoundResultsContainerProps {
  room: Room;
  players: Player[];
  currentPlayer: Player;
  isHost: boolean;
  onLeave: () => void;
  onNext: () => void;
}

export const RoundResultsContainer: React.FC<RoundResultsContainerProps> = ({
  room,
  players,
  currentPlayer,
  isHost,
  onLeave,
  onNext,
}) => {
  const deadPlayer =
    players.find((p) => p.id === room.lastKilledPlayerId) ?? null;

  const isCurrentDead = !!deadPlayer && deadPlayer.id === currentPlayer.id;

  const [step, setStep] = useState<0 | 1>(0);

  let titleText = "Round result";
  let messageText = "";

  if (!deadPlayer) {
    titleText = "No one exploded...";
    messageText = "Somehow everyone survived this round.";
  } else if (isCurrentDead) {
    titleText = "You exploded";
    messageText =
      "Boomi got you this time. You are out for the rest of the game.";
  } else {
    titleText = `${deadPlayer.name} exploded`;
    messageText =
      "Watch the others carefully. The imposters are still among you...";
  }

  let roleTitleText: string | null = null;
  let roleMessageText: string | null = null;
  let hasRoleReveal = false;

  if (deadPlayer && deadPlayer.role) {
    hasRoleReveal = true;
    const roleLabel = deadPlayer.role === "imposter" ? "IMPOSTER" : "CIVILIAN";

    if (isCurrentDead) {
      roleTitleText = `You were an ${roleLabel}!`;
      roleMessageText =
        deadPlayer.role === "imposter"
          ? "Your true allegiance has been revealed. The civilians are one step closer."
          : "You were innocent all along. The imposters are still hiding...";
    } else {
      roleTitleText = `${deadPlayer.name} was an ${roleLabel}.`;
      roleMessageText =
        deadPlayer.role === "imposter"
          ? "Great job! One imposter is gone. But are there more?"
          : "That was a mistake. An innocent player is out of the game.";
    }
  }

  const handlePrimaryClick = () => {
    if (!hasRoleReveal) {
      onNext();
      return;
    }

    if (step === 0) {
      setStep(1);
      return;
    }

    if (step === 1) {
      onNext();
    }
  };

  const primaryButtonLabel = !hasRoleReveal
    ? "Continue"
    : step === 0
    ? "Reveal role"
    : "Next round";

  return (
    <RoundResultsScreen
      step={step}
      titleText={titleText}
      messageText={messageText}
      roleTitleText={roleTitleText}
      roleMessageText={roleMessageText}
      hasRoleReveal={hasRoleReveal}
      isHost={isHost}
      primaryButtonLabel={primaryButtonLabel}
      onPrimaryClick={handlePrimaryClick}
      onLeave={onLeave}
    />
  );
};
