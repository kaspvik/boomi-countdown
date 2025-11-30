import React from "react";
import type { Player, Room } from "../types/game";
import { PixelFrame } from "./ui/PixelFrame";

interface LobbyScreenProps {
  room: Room | null;
  roomLoading: boolean;
  roomError: string | null;
  players: Player[];
  playersLoading: boolean;
  playersError: string | null;
  onLeave: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  room,
  roomLoading,
  roomError,
  players,
  playersLoading,
  playersError,
  onLeave,
}) => {
  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        minHeight: "100vh",
      }}>
      <h1>Boomi Countdown – Lobby</h1>

      <button onClick={onLeave} style={{ marginBottom: "1rem" }}>
        Back to start
      </button>

      <PixelFrame>
        <h2>Room</h2>
        {roomLoading && <p>Loading room...</p>}
        {roomError && <p style={{ color: "red" }}>{roomError}</p>}
        {!roomLoading && !room && !roomError && <p>No room data available.</p>}
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
      </PixelFrame>

      <PixelFrame>
        <h2>Players</h2>
        {playersLoading && <p>Loading players...</p>}
        {playersError && <p style={{ color: "red" }}>{playersError}</p>}
        {!playersLoading && players.length === 0 && !playersError && (
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
      </PixelFrame>
    </main>
  );
};
