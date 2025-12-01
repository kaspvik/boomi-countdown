import React from "react";
import type { Player, Room } from "../types/game";
import styles from "./LobbyScreen.module.css";
import { GameLogo } from "./ui/GameLogo";
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
    <main>
      <section className={styles.frameSection}>
        <GameLogo />
        <div className={styles.roomBox}>
          {roomLoading && <p className="text-subtitle">Loading room...</p>}
          {roomError && <p style={{ color: "red" }}>{roomError}</p>}
          {!roomLoading && !room && !roomError && (
            <p className="text-subtitle">No room data available.</p>
          )}

          {room && (
            <p className={styles.roomCodeText}>
              <span className={styles.roomCodeLabel}>Game Pin:</span>
              <span className={styles.roomCodeValue}>{room.code}</span>
            </p>
          )}
        </div>
      </section>

      <section className={styles.frameSection}>
        <PixelFrame>
          <h2 className="text-title">Players:</h2>

          {playersLoading && (
            <p className="text-subtitle">Loading players...</p>
          )}
          {playersError && <p style={{ color: "red" }}>{playersError}</p>}
          {!playersLoading && players.length === 0 && !playersError && (
            <p className="text-subtitle">No players in this room yet.</p>
          )}

          {players.length > 0 && (
            <ul className={styles.playersGrid}>
              {players.map((player) => (
                <li key={player.id} className={styles.playerItem}>
                  {player.name}
                  {player.isHost && " (host)"}
                </li>
              ))}
            </ul>
          )}
        </PixelFrame>
      </section>

      <div className="buttonRow">
        <PixelButton onClick={onLeave} className="text-button">
          Back to start
        </PixelButton>
        <PixelButton className="text-button">Start Game</PixelButton>
      </div>
    </main>
  );
};
