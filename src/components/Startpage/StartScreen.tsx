import React from "react";
import { PixelButton } from "../../layout";
import { GameLogo } from "../../layout/GameLogo/GameLogo";
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

export const StartScreen: React.FC<StartScreenProps> = ({
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
}) => {
  const isAskingForName =
    pendingAction === "join" || pendingAction === "create";

  return (
    <main className={styles.main}>
      <div className={styles.logo}>
        <GameLogo />
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
