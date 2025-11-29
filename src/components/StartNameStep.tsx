import React from "react";

type ActionKind = "join" | "create";

interface StartNameStepProps {
  action: ActionKind;
  playerName: string;
  roomCode: string;
  onPlayerNameChange: (value: string) => void;
  onConfirmName: () => void;
  onCancelName: () => void;
}

export const StartNameStep: React.FC<StartNameStepProps> = ({
  action,
  playerName,
  roomCode,
  onPlayerNameChange,
  onConfirmName,
  onCancelName,
}) => {
  const isJoin = action === "join";

  return (
    <section
      style={{
        marginTop: "1.5rem",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "4px",
        maxWidth: "300px",
      }}>
      <p style={{ marginTop: 0, marginBottom: "0.75rem" }}>
        {isJoin
          ? "Enter your name to join the room:"
          : "Choose a name before creating the room:"}
      </p>

      {isJoin && roomCode && (
        <p
          style={{
            marginTop: 0,
            marginBottom: "0.75rem",
            fontSize: "0.9rem",
          }}>
          Joining room with code: <strong>{roomCode}</strong>
        </p>
      )}

      <label>
        Your name
        <input
          value={playerName}
          onChange={(e) => onPlayerNameChange(e.target.value)}
          placeholder="e.g. Kasper"
          style={{ display: "block", marginTop: "0.25rem", width: "100%" }}
        />
      </label>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
        <button onClick={onConfirmName}>Continue</button>
        <button type="button" onClick={onCancelName}>
          Cancel
        </button>
      </div>
    </section>
  );
};
