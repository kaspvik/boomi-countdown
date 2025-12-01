import React from "react";
import { StartActions } from "./StartActions";
import { StartNameField } from "./StartNameField";
import { GameLogo } from "./ui/GameLogo";

export type PendingAction = "idle" | "join" | "create";

interface StartScreenProps {
  roomCode: string;
  playerName: string;
  pendingAction: PendingAction;
  onRoomCodeChange: (value: string) => void;
  onPlayerNameChange: (value: string) => void;
  onClickJoin: () => void;
  onClickCreate: () => void;
  onConfirmName: () => void;
  onCancelName: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  roomCode,
  playerName,
  pendingAction,
  onRoomCodeChange,
  onPlayerNameChange,
  onClickJoin,
  onClickCreate,
  onConfirmName,
  onCancelName,
}) => {
  const isAskingForName =
    pendingAction === "join" || pendingAction === "create";

  return (
    <main
      style={{
        minHeight: "100vh",
      }}>
      <GameLogo />

      {!isAskingForName && (
        <StartActions
          roomCode={roomCode}
          onRoomCodeChange={onRoomCodeChange}
          onClickJoin={onClickJoin}
          onClickCreate={onClickCreate}
        />
      )}

      {isAskingForName && (
        <StartNameField
          action={pendingAction === "join" ? "join" : "create"}
          playerName={playerName}
          roomCode={roomCode}
          onPlayerNameChange={onPlayerNameChange}
          onConfirmName={onConfirmName}
          onCancelName={onCancelName}
        />
      )}
    </main>
  );
};
