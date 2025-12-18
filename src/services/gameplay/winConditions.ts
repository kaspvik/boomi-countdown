import type { Player } from "../../types/game";

export type WinningTeam = "civilians" | "imposters" | null;

export function getWinningTeam(players: Player[]): WinningTeam {
  const alive = players.filter((p) => p.alive !== false);

  const aliveImposters = alive.filter((p) => p.role === "imposter").length;
  const aliveCivilians = alive.filter((p) => p.role === "civilian").length;

  if (aliveImposters === 0) {
    return "civilians";
  }

  if (aliveImposters >= aliveCivilians && aliveCivilians > 0) {
    return "imposters";
  }

  return null;
}
