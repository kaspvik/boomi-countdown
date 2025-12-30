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

    const stepValue = room.roundResultsStep ?? "explosion";
    const step: 0 | 1 | 2 =
      stepValue === "role" ? 1 : stepValue === "status" ? 2 : 0;

    const alivePlayers = players.filter((p) => p.alive);
    const aliveImposters = alivePlayers.filter((p) => p.role === "imposter");
    const impostersLeft = aliveImposters.length;

    const isGameOver = room.winner != null;

    let titleText = "Round result";
    let messageText = "";

    if (!deadPlayer) {
      titleText = "No one exploded...";
      messageText = "Somehow everyone survived this round.";
    } else if (isCurrentDead) {
      titleText = "You exploded!";
      messageText =
        "Boomi got you this time. You are out for the rest of the game.";
    } else {
      titleText = `${deadPlayer.name} exploded!`;
      messageText = "The dust settles… time to reveal what really happened.";
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
            ? "Your true allegiance has been revealed."
            : "You were innocent all along.";
      } else {
        roleTitleText = `${deadPlayer.name} was ${article} ${roleLabel}.`;
        roleMessageText =
          deadPlayer.role === "imposter"
            ? "Nice! One imposter is out."
            : "Ouch. An innocent player is out of the game.";
      }
    }

    const statusTitleText = isGameOver
      ? "The game has ended!"
      : impostersLeft > 0
      ? "Imposters are still in the game!"
      : "No imposters remain!";

    const statusMessageText = isGameOver
      ? "Proceed to the Game Over screen to see who won."
      : impostersLeft > 0
      ? `There ${
          impostersLeft === 1 ? "is" : "are"
        } still ${impostersLeft} imposter${
          impostersLeft === 1 ? "" : "s"
        } among the living.`
      : "The last imposter is gone.";

    const primaryButtonLabel = !hasRoleReveal
      ? "Continue"
      : step === 0
      ? "Reveal role"
      : step === 1
      ? "Continue"
      : isGameOver
      ? "See winner"
      : "Continue";

    return {
      deadPlayer,
      isCurrentDead,
      step,
      hasRoleReveal,
      titleText,
      messageText,
      roleTitleText,
      roleMessageText,
      statusTitleText,
      statusMessageText,
      impostersLeft,
      primaryButtonLabel,

      isGameOver,
    };
  }, [
    room.lastKilledPlayerId,
    room.roundResultsStep,
    room.winner,
    players,
    currentPlayer,
  ]);
}
