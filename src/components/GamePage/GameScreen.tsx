import React, { useCallback } from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { killPlayer } from "../../services/killPlayer";
import type { Player, Room } from "../../types/game";
import styles from "../GamePage/GameScreen.module.css";
import { GameTimer } from "./GameTimer";

interface GameScreenProps {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
  roomId: string;
  onLeave: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  room,
  players,
  currentPlayer,
  roomId,
  onLeave,
}) => {
  const bombHolder =
    players.find((p) => p.id === room.currentBombHolder) || null;

  const isCurrentHolder =
    currentPlayer != null && currentPlayer.id === room.currentBombHolder;
  const isAlive = currentPlayer?.alive ?? true;

  const handleTimerTimeout = useCallback(() => {
    if (!currentPlayer || !isCurrentHolder || !isAlive) return;

    (async () => {
      try {
        await killPlayer(roomId, currentPlayer.id);
      } catch (err) {
        console.error("Failed to kill player on timeout", err);
      }
    })();
  }, [currentPlayer, isCurrentHolder, isAlive, roomId]);

  const timerKey = `${room.round}-${room.currentBombHolder ?? "none"}`;

  return (
    <main className={styles.main}>
      <section className={styles.topBar}>
        <div className={styles.leaveButton}>
          <PixelButton onClick={onLeave} className="text-button">
            Leave game
          </PixelButton>
        </div>

        <div className={styles.timer}>
          <GameTimer
            key={timerKey}
            durationSeconds={30}
            onTimeout={handleTimerTimeout}
          />
        </div>

        <div className={styles.emptyBlock} />
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <div className={styles.header}>
              <p className="text-subtitle">Round {room.round}</p>
              {bombHolder && (
                <p className="text-subtitle">
                  Current bomb holder: <strong>{bombHolder.name}</strong>
                </p>
              )}
            </div>
          </PixelFrame>
        </div>
      </section>

      <section className={styles.bottomBar}>
        <PixelButton></PixelButton>
        <p>*BORDET*</p>
        <PixelButton></PixelButton>
      </section>
    </main>
  );
};
