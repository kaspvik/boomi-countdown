import type { Player, RoundVote } from "../../types/game";

export function getTopVotedPlayerForRole(
  votes: RoundVote[],
  players: Player[],
  role: "civilian" | "imposter"
): { player: Player | null; count: number } {
  const filtered = votes.filter((v) => v.roleAtTime === role);
  if (filtered.length === 0) return { player: null, count: 0 };

  const counts: Record<string, number> = {};
  for (const v of filtered) {
    counts[v.targetPlayerId] = (counts[v.targetPlayerId] ?? 0) + 1;
  }

  const entries = Object.entries(counts);
  const topCount = Math.max(...entries.map(([, c]) => c));

  const tiedIds = entries.filter(([, c]) => c === topCount).map(([id]) => id);

  const chosenId = tiedIds[Math.floor(Math.random() * tiedIds.length)];
  const player = players.find((p) => p.id === chosenId) ?? null;

  return { player, count: topCount };
}
