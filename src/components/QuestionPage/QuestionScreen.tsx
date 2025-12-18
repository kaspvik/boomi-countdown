import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import type { Player, Room } from "../../types/game";
import styles from "../QuestionPage/QuestionScreen.module.css";
import { QuestionForm } from "./QuestionForm";

interface QuestionScreenProps {
  room: Room;
  players: Player[];
  currentPlayer: Player;
  round: number;
  roomId: string;
  onLeave: () => void;
  onHostStartRound: () => void;
  isHost: boolean;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  players,
  currentPlayer,
  roomId,
  room,
  onLeave,
}) => {
  return (
    <main className={styles.main}>
      <section className={styles.topBar}>
        <div className={styles.leaveButton}>
          <PixelButton onClick={onLeave} className="text-button">
            Leave game
          </PixelButton>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <QuestionForm
              roomId={roomId}
              round={room.round}
              currentPlayer={currentPlayer}
              players={players}
            />
          </PixelFrame>
        </div>
      </section>
    </main>
  );
};
