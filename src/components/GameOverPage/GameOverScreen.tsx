import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import type { Player, Room } from "../../types/game";
import styles from "./GameOverScreen.module.css";

interface GameOverScreenProps {
  room: Room;
  players: Player[];
  currentPlayer: Player;
  onLeave: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  room,
  currentPlayer,
  onLeave,
}) => {
  const winner = room.winner;

  let title = "Game over";
  let message = "";

  if (winner === "civilians") {
    title = "CIVILIANS WIN!";
    message = "All imposters have been eliminated!";
  } else if (winner === "imposters") {
    title = "IMPOSTERS WIN!";
    message =
      "The imposters reached majority and took over the game. Better luck next time.";
  }

  const isWinnerSide =
    winner != null &&
    currentPlayer.role === (winner === "civilians" ? "civilian" : "imposter");

  return (
    <main className={styles.main}>
      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <div className={styles.frameBody}>
              <h1 className={`text-title ${styles.title}`}>{title}</h1>

              <h2 className={`text-body ${styles.message}`}>{message}</h2>

              {winner && (
                <p className={`text-body ${styles.extra}`}>
                  {isWinnerSide
                    ? "You were on the winning side!"
                    : "You were on the losing side this time."}
                </p>
              )}

              <div className={styles.buttonRow}>
                <PixelButton onClick={onLeave} className="text-button">
                  Back to start
                </PixelButton>
              </div>
            </div>
          </PixelFrame>
        </div>
      </section>
    </main>
  );
};
