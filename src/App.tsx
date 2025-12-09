import { RoomScreenContainer } from "./containers/RoomScreenContainer";
import { StartScreenContainer } from "./containers/StartScreenContainer";
import { GameLayout } from "./layout/GameLayout/GameLayout";
import { useGameStore } from "./store/gameStore";

function App() {
  const screen = useGameStore((s) => s.screen);
  const activeRoomId = useGameStore((s) => s.activeRoomId);
  const leaveLobby = useGameStore((s) => s.leaveLobby);

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
