import React from "react";
import type { Player, Room } from "../types/game";
import { PixelButton } from "./ui/PixelButton";
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
      <h2 className="text-display">Boomi Countdown – Lobby</h2>

      <PixelButton onClick={onLeave} className="text-button">
        Back to start
      </PixelButton>

      <PixelFrame>
        <h2 className="text-title">Room:</h2>
        {roomLoading && <p className="text-subtitle">Loading room...</p>}
        {roomError && <p style={{ color: "red" }}>{roomError}</p>}
        {!roomLoading && !room && !roomError && <p>No room data available.</p>}
        {room && (
          <>
            <p className="text-subtitle">
              <strong className="text-subtitle">Code:</strong> {room.code}
            </p>
          </>
        )}
      </PixelFrame>

      <PixelFrame>
        <h2 className="text-title">Players:</h2>
        {playersLoading && <p className="text-subtitle">Loading players...</p>}
        {playersError && <p style={{ color: "red" }}>{playersError}</p>}
        {!playersLoading && players.length === 0 && !playersError && (
          <p className="text-subtitle">No players in this room yet.</p>
        )}
        {players.length > 0 && (
          <ul>
            {players.map((player) => (
              <li key={player.id} className="text-body">
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
