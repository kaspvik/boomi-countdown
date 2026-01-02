import React from "react";
import { PixelButton } from "../../layout";
import { BoomiCardAnim } from "../Boomi/BoomiCardAnimation/BoomiCardAnim";
import { BoomiHeader } from "../BoomiHeader/BoomiHeader";
import { StartActions } from "./StartActions";
import { StartNameField } from "./StartNameField";
import styles from "./StartScreen.module.css";

export type PendingAction = "idle" | "join" | "create";

interface StartScreenProps {
  roomCode: string;
  playerName: string;
  pendingAction: PendingAction;
  onRoomCodeChange: (value: string) => void;
  onPlayerNameChange: (value: string) => void;
  onClickJoin: () => void;
  onClickCreate: () => void;
  onConfirmName: () => void;
  onCancelName: () => void;
  onHowToPlay: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = (props) => {
  const {
    roomCode,
    playerName,
    pendingAction,
    onRoomCodeChange,
    onPlayerNameChange,
    onClickJoin,
    onClickCreate,
    onConfirmName,
    onCancelName,
    onHowToPlay,
  } = props;

  const isAskingForName =
    pendingAction === "join" || pendingAction === "create";

  return (
    <main className={styles.main}>
      <div className={styles.runner} aria-hidden="true">
        <BoomiCardAnim anim="pass" scale={5} />
      </div>

      <div className={styles.logo}>
        <BoomiHeader variant="start" />
      </div>

      <section className={styles.actionsSection}>
        {!isAskingForName && (
          <StartActions
            roomCode={roomCode}
            onRoomCodeChange={onRoomCodeChange}
            onClickJoin={onClickJoin}
            onClickCreate={onClickCreate}
          />
        )}

        {isAskingForName && (
          <StartNameField
            action={pendingAction === "join" ? "join" : "create"}
            playerName={playerName}
            roomCode={roomCode}
            onPlayerNameChange={onPlayerNameChange}
            onConfirmName={onConfirmName}
            onCancelName={onCancelName}
          />
        )}
      </section>

      <PixelButton className="text-button" size="sm" onClick={onHowToPlay}>
        How to Play
      </PixelButton>
    </main>
  );
};
