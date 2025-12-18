import React from "react";
import { QuestionResultsScreen } from "../components/QuestionResultPage/QuestionResultsScreen";
import { useRoundVotes } from "../hooks/useRoundVotes";
import { getTopVotedPlayerForRole } from "../services/voting/voteHelpers";
import type { Player, Room } from "../types/game";

interface QuestionResultsContainerProps {
  room: Room;
  roomId: string;
  players: Player[];
  currentPlayer: Player;
  isHost: boolean;
  onLeave: () => void;
  onContinue: () => void;
}

export const QuestionResultsContainer: React.FC<
  QuestionResultsContainerProps
> = ({ room, roomId, players, currentPlayer, onLeave, onContinue }) => {
  const { votes, error } = useRoundVotes(roomId, room.round);

  const hasAnyVotes = votes.length > 0;

  const { player: topCivilianTarget } = getTopVotedPlayerForRole(
    votes,
    players,
    "civilian"
  );

  const { player: topImposterTarget } = getTopVotedPlayerForRole(
    votes,
    players,
    "imposter"
  );

  const isCurrentCivilianTop =
    !!topCivilianTarget && topCivilianTarget.id === currentPlayer.id;

  const isCurrentImposterTop =
    !!topImposterTarget && topImposterTarget.id === currentPlayer.id;

  return (
    <QuestionResultsScreen
      room={room}
      onLeave={onLeave}
      onContinue={onContinue}
      hasAnyVotes={hasAnyVotes}
      error={error}
      topCivilianTarget={topCivilianTarget ?? null}
      topImposterTarget={topImposterTarget ?? null}
      isCurrentCivilianTop={isCurrentCivilianTop}
      isCurrentImposterTop={isCurrentImposterTop}
    />
  );
};
