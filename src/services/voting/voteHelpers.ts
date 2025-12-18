import type { Player, RoundVote } from "../../types/game";

export function getTopVotedPlayerForRole(
  votes: RoundVote[],
  players: Player[],
  role: "civilian" | "imposter"
): { player: Player | null; count: number } {
  const filtered = votes.filter((v) => v.roleAtTime === role);
  if (filtered.length === 0) {
    return { player: null, count: 0 };
  }

  const counts: Record<string, number> = {};
  for (const v of filtered) {
    counts[v.targetPlayerId] = (counts[v.targetPlayerId] ?? 0) + 1;
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topId, topCount] = sorted[0];

  const player = players.find((p) => p.id === topId) ?? null;
  return { player, count: topCount };
}
