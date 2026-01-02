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
    <div className={styles.frameWrap}>
      <PixelFrame>
        {isJoin && roomCode && (
          <p className={`text-title ${styles.roomInfo}`}>
            Joining room: <span className={styles.roomCode}>{roomCode}</span>
          </p>
        )}

        <PixelInputField
          label={isJoin ? "Your name" : "Choose a name"}
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          placeholder="Name"
        />

        <p className={`text-body ${styles.nameHint}`}>
          Use your first name so friends recognize you.
        </p>

        <div className={styles.buttonsRow}>
          <PixelButton
            onClick={onCancelName}
            className={`text-button ${styles.button}`}>
            Go Back
          </PixelButton>
          <PixelButton
            onClick={onConfirmName}
            className={`text-button ${styles.button}`}>
            Continue
          </PixelButton>
        </div>
      </PixelFrame>
    </div>
  );
};
