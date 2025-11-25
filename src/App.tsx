import { useState } from "react";
import { addTestPlayer, createRoom } from "./services/rooms";

function App() {
  const [status, setStatus] = useState<string | null>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    setStatus("Skapar rum...");

    try {
      const room = await createRoom();
      setRoomId(room.id);
      setStatus(`Rum skapat! Kod: ${room.code}, id: ${room.id}`);
      console.log("Room created:", room);
    } catch (error) {
      console.error("Error creating room: ", error);
      setStatus("Kunde inte skapa rum 😭");
    }
  };

  const handleAddTestPlayer = async () => {
    if (!roomId) {
      setStatus("Inget rum valt ännu – skapa ett rum först.");
      return;
    }

    setStatus("Lägger till test-spelare...");

    try {
      const player = await addTestPlayer(roomId);
      setStatus(`Spelare tillagd i rum ${roomId}. Player-id: ${player.id}`);
      console.log("Player added:", { roomId, player });
    } catch (error) {
      console.error("Error adding player: ", error);
      setStatus("Kunde inte lägga till spelare 😭");
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Boomi Countdown</h1>

      <button onClick={handleCreateRoom}>Skapa test-room i "rooms"</button>

      <button onClick={handleAddTestPlayer} style={{ marginLeft: "1rem" }}>
        Lägg till test-spelare i senaste rummet
      </button>

      {status && <p>{status}</p>}
      {roomId && <p>Senast skapade roomId: {roomId}</p>}
    </main>
  );
}

export default App;
