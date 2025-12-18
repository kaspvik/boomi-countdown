import { useMemo } from "react";
import type { Player, Room } from "../types/game";

export function useRoundResultsViewModel(params: {
  room: Room;
  players: Player[];
  currentPlayer: Player;
}) {
  const { room, players, currentPlayer } = params;

  return useMemo(() => {
    const deadPlayer =
      players.find((p) => p.id === room.lastKilledPlayerId) ?? null;
    const isCurrentDead = !!deadPlayer && deadPlayer.id === currentPlayer.id;

    const step: 0 | 1 = room.roundResultsStep === "role" ? 1 : 0;

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

    if (deadPlayer?.role) {
      hasRoleReveal = true;
      const roleLabel =
        deadPlayer.role === "imposter" ? "IMPOSTER" : "CIVILIAN";

      const article = roleLabel === "IMPOSTER" ? "an" : "a";

      if (isCurrentDead) {
        roleTitleText = `You were ${article} ${roleLabel}!`;
        roleMessageText =
          deadPlayer.role === "imposter"
            ? "Your true allegiance has been revealed. The civilians are one step closer."
            : "You were innocent all along. The imposters are still hiding...";
      } else {
        roleTitleText = `${deadPlayer.name} was ${article} ${roleLabel}.`;
        roleMessageText =
          deadPlayer.role === "imposter"
            ? "Great job! One imposter is gone. But are there more?"
            : "That was a mistake. An innocent player is out of the game.";
      }
    }

    const primaryButtonLabel = !hasRoleReveal
      ? "Continue"
      : step === 0
      ? "Reveal role"
      : "Next round";

    return {
      deadPlayer,
      isCurrentDead,
      step,
      hasRoleReveal,
      titleText,
      messageText,
      roleTitleText,
      roleMessageText,
      primaryButtonLabel,
    };
  }, [room.lastKilledPlayerId, room.roundResultsStep, players, currentPlayer]);
}
