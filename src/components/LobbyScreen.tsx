import React from "react";
import { usePlayers, useRoom } from "../hooks";

interface LobbyScreenProps {
  roomId: string;
  onLeave: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  roomId,
  onLeave,
}) => {
  const { room, loading: roomLoading, error: roomError } = useRoom(roomId);
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers(roomId);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Boomi Countdown – Lobby</h1>

      <button onClick={onLeave} style={{ marginBottom: "1rem" }}>
        Back to start
      </button>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Room</h2>
        {roomLoading && <p>Loading room...</p>}
        {roomError && <p style={{ color: "red" }}>{roomError}</p>}
        {room && (
          <>
            <p>
              <strong>Code:</strong> {room.code}
            </p>
            <p>
              <strong>Status:</strong> {room.status}
            </p>
          </>
        )}
      </section>

      <section>
        <h2>Players</h2>
        {playersLoading && <p>Loading players...</p>}
        {playersError && <p style={{ color: "red" }}>{playersError}</p>}
        {!playersLoading && players.length === 0 && (
          <p>No players in this room yet.</p>
        )}
        {players.length > 0 && (
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.name}
                {player.isHost && " (host)"}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
