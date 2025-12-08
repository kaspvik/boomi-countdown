import React from "react";
import type { Player, Room } from "../../types/game";
import styles from "../Game/GameScreen.module.css";
import { PixelButton } from "../ui/PixelButton/PixelButton";
import { PixelFrame } from "../ui/PixelFrame/PixelFrame";

interface GameScreenProps {
  room: Room;
  players: Player[];
  currentPlayer: Player | null;
  onLeave: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  room,
  players,
  onLeave,
}) => {
  const bombHolder = players.find((p) => p.id === room.currentBombHolder);

  return (
    <main className={styles.main}>
      <section className={styles.topBar}>
        <div className={styles.leaveButton}>
          <PixelButton onClick={onLeave} className="text-button">
            Leave game
          </PixelButton>
        </div>
        <div className={styles.timer}>
          <p>*Timer*</p>
        </div>
        <div className={styles.emptyBlock}></div>
      </section>

      <section className={styles.content}>
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
      </section>

      <section className={styles.bottomBar}>
        <PixelButton></PixelButton>
        <p>*BORDET*</p>
        <PixelButton></PixelButton>
      </section>
    </main>
  );
};
