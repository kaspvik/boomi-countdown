import React from "react";
import { PixelButton } from "../ui/PixelButton/PixelButton";
import { PixelFrame } from "../ui/PixelFrame/PixelFrame";
import { PixelInputField } from "../ui/PixelInputField/PixelInputField";
import styles from "./StartNameField.module.css";

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
      <p className={`${styles.title} text-title`}>
        {isJoin
          ? "Enter your name to join the room!"
          : "Choose a name before creating the room!"}
      </p>
      {isJoin && roomCode && (
        <p className={`text-subtitle ${styles.roomInfo}`}>
          Joining room with code: {roomCode}
        </p>
      )}
      <PixelInputField
        label="Your name:"
        value={playerName}
        onChange={(e) => onPlayerNameChange(e.target.value)}
        placeholder="e.g. Kasper"
      />
      <div className={styles.buttonsRow}>
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
