import React, { useMemo } from "react";
import { GameScreen } from "../components/GamePage/GameScreen";
import { useRoundUiState } from "../hooks";
import { useTimeoutKillPlayer } from "../hooks/useTimeoutKillPlayer";
import type { Player, Room } from "../types/game";
import { CardPanelContainer } from "./CardPanelContainer";

interface GameScreenContainerProps {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
  roomId: string;
  onLeave: () => void;
}

export const GameScreenContainer: React.FC<GameScreenContainerProps> = ({
  room,
  players,
  currentPlayer,
  roomId,
  onLeave,
}) => {
  const isAlive = currentPlayer?.alive ?? true;
  const isCurrentHolder =
    !!currentPlayer && currentPlayer.id === room.currentBombHolder;

  const bombHolder = useMemo(
    () => players.find((p) => p.id === room.currentBombHolder) ?? null,
    [players, room.currentBombHolder]
  );

  const timerKey = `${room.round}-${room.currentBombHolder ?? "none"}`;
  const durationSeconds = 10000;

  const ui = useRoundUiState({
    roomId,
    players,
    currentPlayer,
    isAlive,
    isCurrentHolder,
  });

  const onTimeout = useTimeoutKillPlayer({
    roomId,
    currentPlayerId: currentPlayer?.id ?? null,
    canDieOnTimeout: isAlive && isCurrentHolder,
  });

  const showInfoBox = !isCurrentHolder && isAlive && !!bombHolder;

  const cardPanelNode = (
    <CardPanelContainer
      room={room}
      roomId={roomId}
      players={players}
      currentPlayer={currentPlayer}
      isOpen={ui.isPassPanelOpen}
      isGuessOpen={ui.isGuessOpen}
      onClose={ui.closePassPanel}
    />
  );

  return (
    <GameScreen
      timerKey={timerKey}
      durationSeconds={durationSeconds}
      onTimeout={onTimeout}
      onLeave={onLeave}
      showInfoBox={showInfoBox}
      bombHolderName={bombHolder?.name ?? null}
      isCurrentHolder={isCurrentHolder}
      isAlive={isAlive}
      // Guess
      isGuessOpen={ui.isGuessOpen}
      guessTargets={ui.guessTargets}
      selectedGuessTargetId={ui.selectedGuessTargetId}
      onSelectGuessTarget={ui.setSelectedGuessTargetId}
      onOpenGuess={ui.openGuess}
      onCancelGuess={ui.cancelGuess}
      onConfirmGuess={ui.confirmGuess}
      // Cards
      isPassPanelOpen={ui.isPassPanelOpen}
      onOpenPassPanel={ui.openPassPanel}
      onCancelPassPanel={ui.closePassPanel}
      canOpenCardsButton={isAlive}
      // Panel content
      cardPanel={cardPanelNode}
    />
  );
};
