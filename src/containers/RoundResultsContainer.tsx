import { doc, updateDoc } from "firebase/firestore";
import React, { useCallback } from "react";
import { RoundResultsScreen } from "../components/RoundResultsPage/RoundResultsScreen";
import { db } from "../firebase";
import { useRoundResultsViewModel } from "../hooks/useRoundResultsViewModel";
import type { Player, Room } from "../types/game";

interface RoundResultsContainerProps {
  room: Room;
  players: Player[];
  currentPlayer: Player;
  isHost: boolean;
  onLeave: () => void;
  onNext: () => void;
}

export const RoundResultsContainer: React.FC<RoundResultsContainerProps> = ({
  room,
  players,
  currentPlayer,
  isHost,
  onLeave,
  onNext,
}) => {
  const vm = useRoundResultsViewModel({ room, players, currentPlayer });

  const handlePrimaryClick = useCallback(async () => {
    if (!vm.hasRoleReveal) {
      onNext();
      return;
    }

    if (room.roundResultsStep !== "role") {
      const roomRef = doc(db, "rooms", room.id);
      try {
        await updateDoc(roomRef, { roundResultsStep: "role" });
      } catch (err) {
        console.error("Failed to set roundResultsStep=role", err);
      }
      return;
    }

    onNext();
  }, [vm.hasRoleReveal, room.roundResultsStep, room.id, onNext]);

  return (
    <RoundResultsScreen
      step={vm.step}
      titleText={vm.titleText}
      messageText={vm.messageText}
      roleTitleText={vm.roleTitleText}
      roleMessageText={vm.roleMessageText}
      hasRoleReveal={vm.hasRoleReveal}
      isHost={isHost}
      primaryButtonLabel={vm.primaryButtonLabel}
      onPrimaryClick={handlePrimaryClick}
      onLeave={onLeave}
    />
  );
};
