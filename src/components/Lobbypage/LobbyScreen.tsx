import React from "react";
import { GameLogo } from "../../layout/GameLogo/GameLogo";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import type { Player, Room } from "../../types/game";
import styles from "./LobbyScreen.module.css";

interface LobbyScreenProps {
  room: Room;
  players: Player[];
  playersLoading: boolean;
  playersError: string | null;
  onLeave: () => void;
  onStartGame: () => void;
  canStartGame: boolean;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  room,
  players,
  playersLoading,
  playersError,
  onLeave,
  onStartGame,
  canStartGame,
}) => {
  return (
    <main className={styles.main}>
      <section className={styles.frameSection}>
        <GameLogo />

        <PixelFrame>
          <div className={styles.roomHeader}>
            <p className={styles.roomCodeText}>
              <span className={styles.roomCodeLabel}>Game Pin:</span>
              <span className={styles.roomCodeValue}>{room.code}</span>
            </p>
          </div>

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

      <div className={styles.buttonRow}>
        <PixelButton onClick={onLeave} className="text-button">
          Back to start
        </PixelButton>

        {canStartGame && (
          <PixelButton onClick={onStartGame} className="text-button">
            Start Game
          </PixelButton>
        )}
      </div>
    </main>
  );
};
