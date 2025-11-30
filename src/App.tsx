// src/App.tsx
import { useState } from "react";
import { LobbyScreenContainer } from "./containers/LobbyScreenContainer";
import { StartScreenContainer } from "./containers/StartScreenContainer";
import { GameLayout } from "./layout/GameLayout";

type Screen = "start" | "lobby";

function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const handleEnterLobby = (roomId: string) => {
    setActiveRoomId(roomId);
    setScreen("lobby");
  };

  const handleLeaveLobby = () => {
    setActiveRoomId(null);
    setScreen("start");
  };

  return (
    <GameLayout>
      {screen === "lobby" && activeRoomId ? (
        <LobbyScreenContainer
          roomId={activeRoomId}
          onLeave={handleLeaveLobby}
        />
      ) : (
        <StartScreenContainer onEnterLobby={handleEnterLobby} />
      )}
    </GameLayout>
  );
}

export default App;
