import { useState } from "react";
import {
  createRoom,
  findRoomByCode,
  generateRoomCode,
  joinRoom,
} from "./services/rooms";

function App() {
  const [status, setStatus] = useState<string | null>(null);
  const [lastRoomId, setLastRoomId] = useState<string | null>(null);
  const [lastRoomCode, setLastRoomCode] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    setStatus("Skapar rum...");

    try {
      const code = generateRoomCode();
      const room = await createRoom(code);

      setLastRoomId(room.id);
      setLastRoomCode(room.code);

      setStatus(`Rum skapat! Kod: ${room.code}, id: ${room.id}`);
      console.log("Room created:", room);
    } catch (error) {
      console.error("Error creating room: ", error);
      setStatus("Kunde inte skapa rum 😭");
    }
  };

  const handleFindRoom = async () => {
    if (!lastRoomCode) {
      setStatus("Ingen rumskod sparad ännu – skapa ett rum först.");
      return;
    }

    setStatus(`Söker efter rum med kod ${lastRoomCode}...`);

    try {
      const room = await findRoomByCode(lastRoomCode);

      if (!room) {
        setStatus(`Inget rum hittades med kod ${lastRoomCode}`);
        return;
      }

      setLastRoomId(room.id);
      setStatus(`Hittade rum! Kod: ${room.code}, id: ${room.id}`);
      console.log("Room found:", room);
    } catch (error) {
      console.error("Error finding room: ", error);
      setStatus("Kunde inte hitta rum 😭");
    }
  };

  const handleJoinRoom = async () => {
    if (!lastRoomId) {
      setStatus("Inget roomId sparat ännu – skapa eller hitta ett rum först.");
      return;
    }

    setStatus("Joinar rum...");

    try {
      // just nu hårdkodat namn, vi kan bygga riktig input sen
      const player = await joinRoom(lastRoomId, "Kasper");
      setStatus(
        `Spelare "${player.name}" joinade rum ${lastRoomId}. Player-id: ${player.id}`
      );
      console.log("Player joined:", { roomId: lastRoomId, player });
    } catch (error) {
      console.error("Error joining room: ", error);
      setStatus("Kunde inte joina rum 😭");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Boomi Countdown – Funktions-test</h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={handleCreateRoom}>Skapa rum</button>
        <button onClick={handleFindRoom}>Hitta rum via kod</button>
        <button onClick={handleJoinRoom}>Joina rum som "Kasper"</button>
      </div>

      {lastRoomCode && <p>Senast skapade rumskod: {lastRoomCode}</p>}
      {lastRoomId && <p>Senast skapade roomId: {lastRoomId}</p>}
      {status && <p>{status}</p>}
    </main>
  );
}

export default App;
