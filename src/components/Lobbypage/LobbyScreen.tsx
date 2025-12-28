import React from "react";
import { GameLogo } from "../../layout/GameLogo/GameLogo";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import panelStyles from "../../layout/PlayerPanel/PlayerPanel.module.css";
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
          <h2 className="text-title">GAME PIN:</h2>

          <div className={panelStyles.headerBox}>
            <h3 className={panelStyles.headerText}>
              <span className={panelStyles.headerValue}>{room.code}</span>
            </h3>
          </div>

          <h2 className="text-title">PLAYERS:</h2>

          {playersLoading && (
            <p className="text-subtitle">LOADING PLAYERS...</p>
          )}
          {playersError && <p style={{ color: "red" }}>{playersError}</p>}
          {!playersLoading && players.length === 0 && !playersError && (
            <p className="text-subtitle">NO PLAYERS IN THIS ROOM YET.</p>
          )}

          {players.length > 0 && (
            <ul
              className={`${panelStyles.playersGrid} ${styles.playersFadeIn}`}>
              {players.map((player) => (
                <li key={player.id} className={panelStyles.playerItem}>
                  {player.name}
                  {player.isHost && " (host)"}
                </li>
              ))}
            </ul>
          )}
        </PixelFrame>
      </section>

      <div className={panelStyles.buttonRow}>
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
