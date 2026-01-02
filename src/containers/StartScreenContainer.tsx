import React, { useCallback, useState } from "react";
import { HowToPlayScreen } from "../components";
import {
  StartScreen,
  type PendingAction,
} from "../components/Startpage/StartScreen";
import { createRoom } from "../services/rooms/createRoom";
import { findRoomByCode } from "../services/rooms/findRoomByCode";
import { generateRoomCode } from "../services/rooms/generateRoomCode";
import { joinRoom } from "../services/rooms/joinRoom";
import { useGameStore } from "../store/gameStore";

type StartView = "start" | "howToPlay";

export const StartScreenContainer: React.FC = () => {
  const [view, setView] = useState<StartView>("start");

  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>("idle");
  const [, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const enterLobby = useGameStore((s) => s.enterLobby);

  const resetNameFlow = useCallback(() => {
    setPendingAction("idle");
    setPlayerNameInput("");
  }, []);

  const handleClickCreate = useCallback(() => {
    setStatus(null);
    setPlayerNameInput("");
    setPendingAction("create");
  }, []);

  const handleClickJoin = useCallback(() => {
    setStatus(null);
    setPlayerNameInput("");
    setPendingAction("join");
  }, []);

  const handleCancelName = useCallback(() => {
    setStatus(null);
    resetNameFlow();
  }, [resetNameFlow]);

  const handleCreateRoomWithName = useCallback(
    async (playerName: string) => {
      setStatus("Creating room...");

      try {
        const code = generateRoomCode();
        const room = await createRoom(code);
        const player = await joinRoom(room.id, playerName, true);

        enterLobby(room.id, player.id, playerName);
        setStatus(
          `Room created with code ${room.code}. You joined as ${playerName}.`
        );
      } catch (error) {
        console.error("Error creating room: ", error);
        setStatus("Could not create room");
      }
    },
    [enterLobby]
  );

  const handleJoinRoomWithName = useCallback(
    async (playerName: string) => {
      const trimmedCode = roomCodeInput.trim();

      if (!trimmedCode) {
        setStatus("Please enter a room code first.");
        return;
      }

      try {
        const room = await findRoomByCode(trimmedCode);

        if (!room) {
          setStatus(`No room found with code ${trimmedCode}.`);
          return;
        }

        const player = await joinRoom(room.id, playerName, false);
        enterLobby(room.id, player.id, playerName);

        setStatus(`You joined room ${room.code} as ${playerName}.`);
      } catch (error) {
        console.error("Error joining room: ", error);
        setStatus("Could not join room");
      }
    },
    [roomCodeInput, enterLobby]
  );

  const handleConfirmName = useCallback(async () => {
    if (isSubmitting) return;

    const trimmedName = playerNameInput.trim();
    if (!trimmedName) {
      setStatus("Please enter a name.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (pendingAction === "create") {
        await handleCreateRoomWithName(trimmedName);
      } else if (pendingAction === "join") {
        await handleJoinRoomWithName(trimmedName);
      }
      resetNameFlow();
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    playerNameInput,
    pendingAction,
    handleCreateRoomWithName,
    handleJoinRoomWithName,
    resetNameFlow,
  ]);

  if (view === "howToPlay") {
    return <HowToPlayScreen onBack={() => setView("start")} />;
  }

  return (
    <>
      <StartScreen
        roomCode={roomCodeInput}
        playerName={playerNameInput}
        pendingAction={pendingAction}
        onRoomCodeChange={setRoomCodeInput}
        onPlayerNameChange={setPlayerNameInput}
        onClickJoin={handleClickJoin}
        onClickCreate={handleClickCreate}
        onConfirmName={handleConfirmName}
        onCancelName={handleCancelName}
        onHowToPlay={() => setView("howToPlay")}
      />
    </>
  );
};
