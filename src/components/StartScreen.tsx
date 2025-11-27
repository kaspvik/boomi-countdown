import React from "react";

interface StartScreenProps {
  roomCode: string;
  onRoomCodeChange: (value: string) => void;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  roomCode,
  onRoomCodeChange,
  onCreateRoom,
  onJoinRoom,
}) => {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Boomi Countdown</h1>

      <section style={{ marginTop: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Room code
            <input
              value={roomCode}
              onChange={(e) => onRoomCodeChange(e.target.value)}
              placeholder="Enter room code"
              style={{ display: "block", marginTop: "0.25rem" }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={onJoinRoom}>Join room</button>
          <button onClick={onCreateRoom}>Create room!</button>
        </div>
      </section>
    </main>
  );
};
