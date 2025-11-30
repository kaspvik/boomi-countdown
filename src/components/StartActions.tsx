import React from "react";

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
    <section
      style={{
        marginTop: "1.5rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        maxWidth: "300px",
      }}>
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
        <button onClick={onClickJoin}>Enter</button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "4rem",
        }}>
        <button onClick={onClickCreate}>Create a room!</button>
      </div>
    </section>
  );
};
