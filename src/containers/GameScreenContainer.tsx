import React, { useCallback, useMemo, useRef, useState } from "react";
import { GameScreen } from "../components/GamePage/GameScreen";
import { useRoundUiState } from "../hooks";
import { useTimeoutKillPlayer } from "../hooks/useTimeoutKillPlayer";
import { killPlayer } from "../services/gameplay/killPlayer";
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

  const [secondsLeft, setSecondsLeft] = useState<number>(durationSeconds);

  const passHere =
    !!currentPlayer &&
    currentPlayer.alive !== false &&
    isCurrentHolder &&
    room.phase === "round" &&
    room.roundResultsStep === null &&
    room.lastKilledPlayerId === currentPlayer.id;

  const ticking =
    isAlive && isCurrentHolder && secondsLeft <= 10 && secondsLeft > 0;

  const [explodeKey, setExplodeKey] = useState<string | null>(null);

  const ui = useRoundUiState({
    roomId,
    players,
    currentPlayer,
    isAlive,
    isCurrentHolder,
  });

  const killOnTimeout = useTimeoutKillPlayer({
    roomId,
    currentPlayerId: currentPlayer?.id ?? null,
    canDieOnTimeout: isAlive && isCurrentHolder,
  });

  const explodeFromRoomHere =
    !!currentPlayer &&
    currentPlayer.alive !== false &&
    isCurrentHolder &&
    room.roundResultsStep === "explosion" &&
    room.lastKilledPlayerId === currentPlayer.id;

  const handledRoomExplodeRef = useRef<string | null>(null);

  const onTimeout = useCallback(() => {
    if (!(isAlive && isCurrentHolder)) return;
    setExplodeKey(`timeout-${room.round}-${room.currentBombHolder ?? "none"}`);
  }, [isAlive, isCurrentHolder, room.round, room.currentBombHolder]);

  const onExplodeComplete = useCallback(async () => {
    if (explodeFromRoomHere && currentPlayer) {
      const key = `${room.round}-${currentPlayer.id}-${
        room.lastKilledPlayerId ?? "none"
      }`;
      if (handledRoomExplodeRef.current === key) return;
      handledRoomExplodeRef.current = key;

      await killPlayer(roomId, currentPlayer.id);
      return;
    }

    if (explodeKey) {
      await killOnTimeout();
      setExplodeKey(null);
    }
  }, [
    explodeFromRoomHere,
    currentPlayer,
    room.round,
    room.lastKilledPlayerId,
    roomId,
    explodeKey,
    killOnTimeout,
  ]);

  const showInfoBox = !isCurrentHolder && isAlive && !!bombHolder;

  const effectiveExplodeKey =
    explodeKey ??
    (explodeFromRoomHere
      ? `room-explode-${room.round}-${room.lastKilledPlayerId ?? "none"}`
      : null);

  const boomiAnim = effectiveExplodeKey
    ? "explode"
    : passHere
    ? "pass"
    : ticking
    ? "tick"
    : "idle";

  const boomiAnimKey = effectiveExplodeKey
    ? effectiveExplodeKey
    : passHere
    ? `pass-${timerKey}-${room.lastKilledPlayerId ?? "none"}`
    : ticking
    ? `tick-${timerKey}`
    : `idle-${timerKey}`;

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
      onTimerTick={setSecondsLeft}
      boomiAnim={boomiAnim}
      boomiAnimKey={boomiAnimKey}
      onBoomiExplodeComplete={
        effectiveExplodeKey ? onExplodeComplete : undefined
      }
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
      cardPanel={({ requestBoomiExit }) => (
        <CardPanelContainer
          room={room}
          roomId={roomId}
          players={players}
          currentPlayer={currentPlayer}
          isOpen={ui.isPassPanelOpen}
          isGuessOpen={ui.isGuessOpen}
          onClose={ui.closePassPanel}
          requestBoomiExit={requestBoomiExit}
        />
      )}
    />
  );
};
