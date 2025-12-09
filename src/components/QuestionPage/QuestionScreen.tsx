import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import type { Player, Room } from "../../types/game";
import styles from "../QuestionPage/QuestionScreen.module.css";
import { QuestionForm } from "./QuestionForm";

interface QuestionScreenProps {
  room: Room;
  players: Player[];
  currentPlayer: Player;
  roomId: string;
  onLeave: () => void;
  onHostStartRound: () => void; // host-knapp: gå vidare till GameScreen
  isHost: boolean;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  room,
  players,
  currentPlayer,
  roomId,
  onLeave,
  onHostStartRound,
  isHost,
}) => {
  const bombHolder =
    players.find((p) => p.id === room.currentBombHolder) || null;

  return (
    <main className={styles.main}>
      <section className={styles.topBar}>
        <div className={styles.leaveButton}>
          <PixelButton onClick={onLeave} className="text-button">
            Leave game
          </PixelButton>
        </div>

        <div className={styles.timer}>
          <p className="text-subtitle">Question phase</p>
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

            <QuestionForm
              roomId={roomId}
              round={room.round}
              currentPlayer={currentPlayer}
              players={players}
            />

            {isHost && (
              <div style={{ marginTop: "1rem" }}>
                <PixelButton onClick={onHostStartRound} className="text-button">
                  Start round
                </PixelButton>
              </div>
            )}
          </PixelFrame>
        </div>
      </section>
    </main>
  );
};
