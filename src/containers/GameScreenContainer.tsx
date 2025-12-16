import React, { useCallback, useMemo, useState } from "react";
import { GameScreen } from "../components/GamePage/GameScreen";
import { killPlayer } from "../services/killPlayer";
import { resolveGuess } from "../services/resolveGuess";
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
  const bombHolder =
    players.find((p) => p.id === room.currentBombHolder) || null;

  const isCurrentHolder =
    currentPlayer != null && currentPlayer.id === room.currentBombHolder;
  const isAlive = currentPlayer?.alive ?? true;

  const [isGuessOpen, setIsGuessOpen] = useState(false);
  const [selectedGuessTargetId, setSelectedGuessTargetId] = useState<
    string | null
  >(null);

  const [isPassPanelOpen, setIsPassPanelOpen] = useState(false);

  const guessTargets = useMemo(
    () =>
      players.filter(
        (p) => p.alive !== false && currentPlayer && p.id !== currentPlayer.id
      ),
    [players, currentPlayer]
  );

  const baseDurationSeconds = 10000;
  const durationSeconds = baseDurationSeconds;

  const timerKey = `${room.round}-${room.currentBombHolder ?? "none"}`;

  const handleTimerTimeout = useCallback(() => {
    if (!currentPlayer || !isCurrentHolder || !isAlive) return;

    (async () => {
      try {
        await killPlayer(roomId, currentPlayer.id);
      } catch (err) {
        console.error("Failed to kill player on timeout", err);
      }
    })();
  }, [currentPlayer, isCurrentHolder, isAlive, roomId]);

  const handleOpenGuess = () => {
    if (!isCurrentHolder || !isAlive || isPassPanelOpen) return;
    setIsGuessOpen(true);
    setSelectedGuessTargetId(null);
  };

  const handleCancelGuess = () => {
    setIsGuessOpen(false);
    setSelectedGuessTargetId(null);
  };

  const handleConfirmGuess = async () => {
    if (
      !currentPlayer ||
      !isCurrentHolder ||
      !isAlive ||
      !selectedGuessTargetId
    ) {
      return;
    }

    try {
      await resolveGuess(roomId, currentPlayer.id, selectedGuessTargetId);
    } catch (err) {
      console.error("Failed to resolve guess", err);
    }

    setIsGuessOpen(false);
    setSelectedGuessTargetId(null);
  };

  const handleOpenPassPanel = () => {
    if (!isAlive) return;
    if (isGuessOpen) return;
    setIsPassPanelOpen(true);
  };

  const handleCancelPassPanel = () => {
    setIsPassPanelOpen(false);
  };

  const cardPanelNode = (
    <CardPanelContainer
      room={room}
      roomId={roomId}
      players={players}
      currentPlayer={currentPlayer}
      isOpen={isPassPanelOpen}
      isGuessOpen={isGuessOpen}
      onClose={handleCancelPassPanel}
    />
  );

  const canOpenCardsButton = isAlive;

  return (
    <>
      <GameScreen
        timerKey={timerKey}
        durationSeconds={durationSeconds}
        onTimeout={handleTimerTimeout}
        onLeave={onLeave}
        showInfoBox={!isCurrentHolder && isAlive && !!bombHolder}
        bombHolderName={bombHolder?.name ?? null}
        isCurrentHolder={isCurrentHolder}
        isAlive={isAlive}
        // Guess
        isGuessOpen={isGuessOpen}
        guessTargets={guessTargets}
        selectedGuessTargetId={selectedGuessTargetId}
        onSelectGuessTarget={setSelectedGuessTargetId}
        onOpenGuess={handleOpenGuess}
        onCancelGuess={handleCancelGuess}
        onConfirmGuess={handleConfirmGuess}
        // Cards
        isPassPanelOpen={isPassPanelOpen}
        onOpenPassPanel={handleOpenPassPanel}
        onCancelPassPanel={handleCancelPassPanel}
        canOpenCardsButton={canOpenCardsButton}
        // Panel content
        cardPanel={cardPanelNode}
      />
    </>
  );
};
