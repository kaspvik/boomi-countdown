import React from "react";
import { PixelButton } from "../ui/PixelButton/PixelButton";
import { PixelFrame } from "../ui/PixelFrame/PixelFrame";
import { PixelInputField } from "../ui/PixelInputField/PixelInputField";

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
      <div style={{ marginBottom: "1.5rem" }}>
        <PixelInputField
          label="Join a room:"
          placeholder="Enter room code"
          value={roomCode}
          onChange={(e) => onRoomCodeChange(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <PixelButton onClick={onClickJoin} className="text-button">
          Enter
        </PixelButton>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
        }}>
        <PixelButton onClick={onClickCreate} className="text-button">
          Create a room!
        </PixelButton>
      </div>
    </PixelFrame>
  );
};
