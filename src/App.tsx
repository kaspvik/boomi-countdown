import { useState } from "react";
import { usePlayers, useRoom } from "./hooks";
import {
  createRoom,
  findRoomByCode,
  generateRoomCode,
  joinRoom,
} from "./services/rooms";

function App() {
  const [status, setStatus] = useState<string | null>(null);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [lastCreatedRoomCode, setLastCreatedRoomCode] = useState<string | null>(
    null
  );
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const [playerNameInput, setPlayerNameInput] = useState("");

  const {
    room,
    loading: roomLoading,
    error: roomError,
  } = useRoom(activeRoomId);
  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers(activeRoomId);

  const handleCreateRoom = async () => {
    setStatus("Creating room...");

    try {
      const code = generateRoomCode();
      const createdRoom = await createRoom(code);

      setActiveRoomId(createdRoom.id);
      setLastCreatedRoomCode(createdRoom.code);
      setRoomCodeInput(createdRoom.code);

      setStatus(
        `Room created! Code: ${createdRoom.code}. Share the code with your friends.`
      );
      console.log("Room created:", createdRoom);
    } catch (error) {
      console.error("Error creating room: ", error);
      setStatus("Could not create room 😭");
    }
  };

  const handleJoinByCode = async () => {
    const trimmedCode = roomCodeInput.trim();
    const trimmedName = playerNameInput.trim();

    if (!trimmedCode || !trimmedName) {
      setStatus("Please fill in both room code and name first.");
      return;
    }

    setStatus(`Searching for room with code ${trimmedCode}...`);

    try {
      const foundRoom = await findRoomByCode(trimmedCode);

      if (!foundRoom) {
        setStatus(`No room was found with code ${trimmedCode}.`);
        return;
      }

      setStatus(`Room found! Joining as ${trimmedName}...`);

      const player = await joinRoom(foundRoom.id, trimmedName);

      setActiveRoomId(foundRoom.id);

      setStatus(
        `You have now joined room ${foundRoom.code} as "${player.name}". Player id: ${player.id}`
      );
      console.log("Player joined:", { roomId: foundRoom.id, player });
    } catch (error) {
      console.error("Error joining room by code: ", error);
      setStatus("Could not join room 😭");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Boomi Countdown – Lobby / Realtime test</h1>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Start new game</h2>
        <button onClick={handleCreateRoom}>Create new room</button>

        {lastCreatedRoomCode && (
          <p style={{ marginTop: "0.5rem" }}>
            <strong>Room code:</strong> {lastCreatedRoomCode} <br />
            Share this code with your friends so they can join the game.
          </p>
        )}
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Join game</h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            maxWidth: "260px",
          }}>
          <label>
            Room code:
            <input
              value={roomCodeInput}
              onChange={(e) => setRoomCodeInput(e.target.value)}
              placeholder="e.g. 482143"
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>

          <label>
            Your name:
            <input
              value={playerNameInput}
              onChange={(e) => setPlayerNameInput(e.target.value)}
              placeholder="e.g. Kasper"
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>

          <button onClick={handleJoinByCode}>Join game</button>
        </div>
      </section>

      {status && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2>Status</h2>
          <p>{status}</p>
        </section>
      )}

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>Active room (useRoom)</h2>
        {!activeRoomId && <p>No room selected yet.</p>}
        {roomLoading && <p>Loading room...</p>}
        {roomError && <p style={{ color: "red" }}>{roomError}</p>}
        {room && (
          <div>
            <p>
              <strong>Room code:</strong> {room.code}
            </p>
            <p>
              <strong>Status:</strong> {room.status}
            </p>
          </div>
        )}
      </section>

      <section>
        <h2>Players in room (usePlayers)</h2>
        {!activeRoomId && <p>No room selected yet.</p>}
        {playersLoading && <p>Loading players...</p>}
        {playersError && <p style={{ color: "red" }}>{playersError}</p>}

        {activeRoomId && !playersLoading && players.length === 0 && (
          <p>No players in the room yet.</p>
        )}

        {players.length > 0 && (
          <ul>
            {players.map((player) => (
              <li key={player.id}>
                {player.name}
                {player.isHost && " (host)"}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;
