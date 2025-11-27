import { useState } from "react";
import { LobbyScreen } from "./components/LobbyScreen";
import { StartScreen } from "./components/StartScreen";
import {
  createRoom,
  findRoomByCode,
  generateRoomCode,
  joinRoom,
} from "./services/rooms";

type Screen = "start" | "lobby";

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const [roomCodeInput, setRoomCodeInput] = useState("");

  const [status, setStatus] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    setStatus("Creating room...");

    try {
      const code = generateRoomCode();
      const room = await createRoom(code);

      await joinRoom(room.id, "Host");

      setActiveRoomId(room.id);
      setScreen("lobby");
      setStatus(`Room created with code ${room.code}`);
    } catch (error) {
      console.error("Error creating room: ", error);
      setStatus("Could not create room 😭");
    }
  };

  const handleJoinRoom = async () => {
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

      const name = window.prompt("Enter your name") || "Player";

      await joinRoom(room.id, name);

      setActiveRoomId(room.id);
      setScreen("lobby");
      setStatus(`You joined room ${room.code} as ${name}`);
    } catch (error) {
      console.error("Error joining room: ", error);
      setStatus("Could not join room 😭");
    }
  };

  const handleLeaveLobby = () => {
    setActiveRoomId(null);
    setScreen("start");
    setStatus(null);
  };

  if (screen === "lobby" && activeRoomId) {
    return (
      <>
        <LobbyScreen roomId={activeRoomId} onLeave={handleLeaveLobby} />
        {status && <p style={{ padding: "0 2rem" }}>{status}</p>}
      </>
    );
  }

  return (
    <>
      <StartScreen
        roomCode={roomCodeInput}
        onRoomCodeChange={setRoomCodeInput}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />
      {status && <p style={{ padding: "0 2rem" }}>{status}</p>}
    </>
  );
}

export default App;
