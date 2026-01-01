import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { PixelInputField } from "../../layout/PixelInputField/PixelInputField";
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
      {isJoin && roomCode && (
        <p className={`text-title ${styles.roomInfo}`}>
          Joining room with code: {roomCode}
        </p>
      )}

      <PixelInputField
        label={
          isJoin
            ? "Enter your name to join the room!"
            : "Choose a name before creating the room!"
        }
        value={playerName}
        onChange={(e) => onPlayerNameChange(e.target.value)}
        placeholder="Name"
      />

      <p className={`text-body ${styles.nameHint}`}>
        For the best experience, use your first name <br /> (so friends
        recognize you)
      </p>

      <div className={styles.buttonsRow}>
        <PixelButton onClick={onCancelName} className="text-button">
          Go Back
        </PixelButton>
        <PixelButton onClick={onConfirmName} className="text-button">
          Continue
        </PixelButton>
      </div>
    </PixelFrame>
  );
};
