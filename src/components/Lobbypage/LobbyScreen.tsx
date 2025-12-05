import React from "react";
import type { Player, Room } from "../../types/game";
import { GameScreen } from "../Game/GameScreen";
import { RoleScreen } from "../Role/RoleScreen";
import { GameLogo } from "../ui/GameLogo/GameLogo";
import { PixelButton } from "../ui/PixelButton/PixelButton";
import { PixelFrame } from "../ui/PixelFrame/PixelFrame";
import styles from "./LobbyScreen.module.css";

interface LobbyScreenProps {
  room: Room | null;
  roomLoading: boolean;
  roomError: string | null;
  players: Player[];
  playersLoading: boolean;
  playersError: string | null;
  onLeave: () => void;
  onStartGame: () => void;
  canStartGame: boolean;
  gameStarted: boolean;
  currentPlayer: Player | null;
  allPlayersReady: boolean;
  onAcknowledgeRole: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = (props) => {
  const {
    room,
    roomLoading,
    roomError,
    players,
    playersLoading,
    playersError,
    onLeave,
    onStartGame,
    canStartGame,
    gameStarted,
    currentPlayer,
    allPlayersReady,
    onAcknowledgeRole,
  } = props;

  // vänta tills room och currentPlayer är laddade
  if (roomLoading || playersLoading || !room) {
    return (
      <main className={styles.main}>
        <p className="text-subtitle">Loading...</p>
      </main>
    );
  }

  // 1) ROLE REVEAL
  if (gameStarted && room.phase === "role_reveal" && currentPlayer) {
    const role = currentPlayer.role ?? "civilian";
    const hasAcknowledged = !!currentPlayer.hasAcknowledgedRole;

    return (
      <main className={styles.main}>
        <section className={styles.frameSection}>
          <GameLogo />
          <RoleScreen
            role={role}
            hasAcknowledged={hasAcknowledged}
            allReady={allPlayersReady}
            onAcknowledge={onAcknowledgeRole}
          />
        </section>
      </main>
    );
  }

  // 2) MAIN ROUND / GAME
  if (gameStarted && room.phase === "round" && currentPlayer) {
    return (
      <GameScreen
        room={room}
        players={players}
        currentPlayer={currentPlayer}
        onLeave={onLeave}
      />
    );
  }

  return (
    <main className={styles.main}>
      <section className={styles.frameSection}>
        <GameLogo />

        <PixelFrame>
          <div className={styles.roomHeader}>
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
