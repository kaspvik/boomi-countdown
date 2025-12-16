import { useEffect, useState } from "react";
import { RoomScreenContainer } from "./containers/RoomScreenContainer";
import { StartScreenContainer } from "./containers/StartScreenContainer";
import { GameLayout } from "./layout/GameLayout/GameLayout";
import { ensureSignedIn } from "./services/authService";
import { useGameStore } from "./store/gameStore";

function App() {
  const screen = useGameStore((s) => s.screen);
  const activeRoomId = useGameStore((s) => s.activeRoomId);
  const leaveLobby = useGameStore((s) => s.leaveLobby);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await ensureSignedIn();
      } catch (err) {
        console.error("Failed to sign in anonymously", err);
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

  if (!authReady) {
    return <p className="text-subtitle">Connecting to game server...</p>;
  }

  return (
    <GameLayout>
      {screen === "lobby" && activeRoomId ? (
        <RoomScreenContainer roomId={activeRoomId} onLeave={leaveLobby} />
      ) : (
        <StartScreenContainer />
      )}
    </GameLayout>
  );
}

export default App;
