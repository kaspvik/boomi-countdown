import { useEffect, useState } from "react";
import { RoomScreenContainer } from "./containers/RoomScreenContainer";
import { StartScreenContainer } from "./containers/StartScreenContainer";
import { GameLayout } from "./layout/GameLayout/GameLayout";
import { ensureSignedIn } from "./services/auth/authService";
import { useGameStore } from "./store/gameStore";

function App() {
  const activeRoomId = useGameStore((s) => s.activeRoomId);
  const leaveLobby = useGameStore((s) => s.leaveLobby);
  const hasHydrated = useGameStore((s) => s.hasHydrated);

  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await ensureSignedIn();
        setAuthReady(true);
      } catch (err) {
        console.error("Failed to sign in anonymously", err);
        setAuthError("Could not connect. Please refresh and try again.");
      }
    })();
  }, []);

  if (authError) {
    return <p className="text-subtitle">{authError}</p>;
  }
  if (!authReady || !hasHydrated) {
    return <p className="text-subtitle">Connecting to game server...</p>;
  }

  return (
    <GameLayout>
      {activeRoomId ? (
        <RoomScreenContainer roomId={activeRoomId} onLeave={leaveLobby} />
      ) : (
        <StartScreenContainer />
      )}
    </GameLayout>
  );
}

export default App;
