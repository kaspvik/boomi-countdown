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
        <label>
          Join a room
          <input
            value={roomCode}
            onChange={(e) => onRoomCodeChange(e.target.value)}
            placeholder="Enter room code"
            style={{ display: "block", marginTop: "0.25rem", width: "100%" }}
          />
        </label>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <PixelButton onClick={onClickJoin}>Enter</PixelButton>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "4rem",
        }}>
        <PixelButton onClick={onClickCreate}>Create a room!</PixelButton>
      </div>
    </PixelFrame>
  );
};
