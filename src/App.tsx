import { useState } from "react";
import { LobbyScreenContainer } from "./containers/LobbyScreenContainer";
import { StartScreenContainer } from "./containers/StartScreenContainer";

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

  if (screen === "lobby" && activeRoomId) {
    return (
      <LobbyScreenContainer roomId={activeRoomId} onLeave={handleLeaveLobby} />
    );
  }

  return <StartScreenContainer onEnterLobby={handleEnterLobby} />;
}

export default App;
