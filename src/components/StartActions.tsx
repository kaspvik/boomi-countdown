import React from "react";
import { PixelButton } from "./ui/PixelButton";
import { PixelFrame } from "./ui/PixelFrame";

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
      <div style={{ marginBottom: "1rem" }}>
        <label className="text-body">
          Join a room:
          <input
            value={roomCode}
            onChange={(e) => onRoomCodeChange(e.target.value)}
            placeholder="Enter room code"
            className="text-input"
            style={{ display: "block", marginTop: "0.25rem", width: "100%" }}
          />
        </label>
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
          marginTop: "4rem",
        }}>
        <PixelButton onClick={onClickCreate} className="text-button">
          Create a room!
        </PixelButton>
      </div>
    </PixelFrame>
  );
};
