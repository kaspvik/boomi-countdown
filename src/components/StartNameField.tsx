import React from "react";
import { PixelButton } from "./ui/PixelButton";
import { PixelFrame } from "./ui/PixelFrame";
import { PixelInputField } from "./ui/PixelInputField";

type ActionKind = "join" | "create";

interface StartNameFieldProps {
  action: ActionKind;
  playerName: string;
  roomCode: string;
  onPlayerNameChange: (value: string) => void;
  onConfirmName: () => void;
  onCancelName: () => void;
}

export const StartNameField: React.FC<StartNameFieldProps> = ({
  action,
  playerName,
  roomCode,
  onPlayerNameChange,
  onConfirmName,
  onCancelName,
}) => {
  const isJoin = action === "join";

  return (
    <PixelFrame>
      <p
        style={{ marginTop: 0, marginBottom: "0.75rem" }}
        className="text-title">
        {isJoin
          ? "Enter your name to join the room!"
          : "Choose a name before creating the room!"}
      </p>

      {isJoin && roomCode && (
        <p className="text-subtitle">Joining room with code: {roomCode}</p>
      )}

      <label className="text-subtitle">
        Your name:
        <PixelInputField
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          placeholder="e.g. Kasper"
          style={{ display: "block", marginTop: "0.25rem", width: "100%" }}
        />
      </label>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        <PixelButton onClick={onConfirmName} className="text-button">
          Continue
        </PixelButton>
        <PixelButton onClick={onCancelName} className="text-button">
          Go Back
        </PixelButton>
      </div>
    </PixelFrame>
  );
};
