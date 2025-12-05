import React from "react";
import type { Player, Room } from "../../types/game";
import styles from "../Game/GameScreen.module.css";
import { PixelButton } from "../ui/PixelButton/PixelButton";
import { PixelFrame } from "../ui/PixelFrame/PixelFrame";

interface GameScreenProps {
  room: Room;
  players: Player[];
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

      <div className={styles.footer}>
        <PixelButton onClick={onLeave} className="text-button">
          Leave game
        </PixelButton>
      </div>
    </main>
  );
};
