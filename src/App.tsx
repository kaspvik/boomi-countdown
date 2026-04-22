import { useEffect, useState } from "react";
import { RoomScreenContainer } from "./containers/RoomScreenContainer";
import { StartScreenContainer } from "./containers/StartScreenContainer";
import { GameLayout } from "./layout/GameLayout/GameLayout";
import { ensureSignedIn } from "./services/auth/authService";
import { useGameStore } from "./store/gameStore";

const PRELOAD_IMAGES = [
  "/Timer.png",
  "/pixel-frame.png",
  "/Chomb3.png",
  "/pixel-button.png",
  "/pixel-fireflies.gif",
  "/table.png",
  "/soundbutton-off.png",
  "/soundbutton-on.png",
];

function preloadImages(srcs: string[]): Promise<void> {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve();
          img.src = src;
        })
    )
  ).then(() => undefined);
}

function App() {
  const activeRoomId = useGameStore((s) => s.activeRoomId);
  const leaveLobby = useGameStore((s) => s.leaveLobby);
  const hasHydrated = useGameStore((s) => s.hasHydrated);

  const [authReady, setAuthReady] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([
          ensureSignedIn(),
          preloadImages(PRELOAD_IMAGES).then(() => setImagesReady(true)),
        ]);
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
  if (!authReady || !hasHydrated || !imagesReady) {
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
