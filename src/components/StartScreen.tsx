import React from "react";
import { StartActions } from "./StartActions";
import { StartNameField } from "./StartNameField";

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
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
      }}>
      <h1>Boomi Countdown</h1>

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
