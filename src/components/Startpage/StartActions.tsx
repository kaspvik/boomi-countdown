import React from "react";
import { PixelButton, PixelFrame, PixelInputField } from "../../layout";
import styles from "./StartActions.module.css";

interface StartActionsProps {
  roomCode: string;
  onRoomCodeChange: (value: string) => void;
  onClickJoin: () => void;
  onClickCreate: () => void;
}

export const StartActions: React.FC<StartActionsProps> = ({
  roomCode,
  onRoomCodeChange,
  onClickJoin,
  onClickCreate,
}) => {
  return (
    <PixelFrame>
      <div className={styles.inputBlock}>
        <PixelInputField
          label="Join a room:"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => onRoomCodeChange(e.target.value)}
        />
      </div>

      <div className={styles.centerRow}>
        <PixelButton onClick={onClickJoin} className="text-button">
          Enter
        </PixelButton>
      </div>

      <div className={styles.centerRowCreate}>
        <PixelButton onClick={onClickCreate} className="text-button">
          Create a room!
        </PixelButton>
      </div>
    </PixelFrame>
  );
};
