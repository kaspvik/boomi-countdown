import type { Player, RoundVote } from "../../types/game";

export function getTopVotedPlayerForRole(
  votes: RoundVote[],
  players: Player[],
  role: "civilian" | "imposter"
): { player: Player | null; count: number } {
  const eligibleTargetIds = new Set(
    players
      .filter((p) => p.alive !== false)
      .filter((p) => (role === "imposter" ? p.role !== "imposter" : true))
      .map((p) => p.id)
  );

  const filtered = votes.filter(
    (v) => v.roleAtTime === role && eligibleTargetIds.has(v.targetPlayerId)
  );

  if (filtered.length === 0) return { player: null, count: 0 };

  const counts: Record<string, number> = {};
  for (const v of filtered) {
    counts[v.targetPlayerId] = (counts[v.targetPlayerId] ?? 0) + 1;
  }

  const entries = Object.entries(counts);
  const topCount = Math.max(...entries.map(([, c]) => c));

  const tiedIds = entries
    .filter(([, c]) => c === topCount)
    .map(([id]) => id)
    .sort();

  const chosenId = tiedIds[0];
  const player = players.find((p) => p.id === chosenId) ?? null;

  return { player, count: topCount };
}
