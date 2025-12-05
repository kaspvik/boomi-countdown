import React, { useState } from "react";
import {
  StartScreen,
  type PendingAction,
} from "../components/Startpage/StartScreen";
import {
  createRoom,
  findRoomByCode,
  generateRoomCode,
  joinRoom,
} from "../services/rooms";

interface StartScreenContainerProps {
  onEnterLobby: (roomId: string, playerId: string) => void;
}

export const StartScreenContainer: React.FC<StartScreenContainerProps> = ({
  onEnterLobby,
}) => {
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [playerNameInput, setPlayerNameInput] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>("idle");
  const [status, setStatus] = useState<string | null>(null);

  const handleClickCreate = () => {
    setStatus(null);
    setPlayerNameInput("");
    setPendingAction("create");
  };
  const handleClickJoin = () => {
    setStatus(null);
    setPlayerNameInput("");
    setPendingAction("join");
  };
  const handleCancelName = () => {
    setPendingAction("idle");
    setPlayerNameInput("");
    setStatus(null);
  };
  const handleConfirmName = async () => {
    const trimmedName = playerNameInput.trim();

    if (!trimmedName) {
      setStatus("Please enter a name.");
      return;
    }

    if (pendingAction === "create") {
      await handleCreateRoomWithName(trimmedName);
    } else if (pendingAction === "join") {
      await handleJoinRoomWithName(trimmedName);
    }

    setPendingAction("idle");
    setPlayerNameInput("");
  };

  const handleCreateRoomWithName = async (playerName: string) => {
    setStatus("Creating room...");

    try {
      const code = generateRoomCode();
      const room = await createRoom(code);

      const player = await joinRoom(room.id, playerName, true);

      onEnterLobby(room.id, player.id);

      setStatus(
        `Room created with code ${room.code}. You joined as ${playerName}.`
      );
    } catch (error) {
      console.error("Error creating room: ", error);
      setStatus("Could not create room 😭");
    }
  };

  const handleJoinRoomWithName = async (playerName: string) => {
    const trimmedCode = roomCodeInput.trim();

    if (!trimmedCode) {
      setStatus("Please enter a room code first.");
      return;
    }

    setStatus(`Searching for room with code ${trimmedCode}...`);

    try {
      const room = await findRoomByCode(trimmedCode);

      if (!room) {
        setStatus(`No room found with code ${trimmedCode}.`);
        return;
      }

      const player = await joinRoom(room.id, playerName, false);

      onEnterLobby(room.id, player.id);

      setStatus(`You joined room ${room.code} as ${playerName}.`);
    } catch (error) {
      console.error("Error joining room: ", error);
      setStatus("Could not join room 😭");
    }
  };

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
      />
      {status && (
        <p style={{ padding: "0 2rem", fontFamily: "handjet" }}>{status}</p>
      )}
    </>
  );
};
