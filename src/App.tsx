import { LobbyScreenContainer } from "./containers/LobbyScreenContainer";
import { StartScreenContainer } from "./containers/StartScreenContainer";
import { GameLayout } from "./layout/GameLayout";
import { useGameStore } from "./store/gameStore";

function App() {
  const screen = useGameStore((s) => s.screen);
  const activeRoomId = useGameStore((s) => s.activeRoomId);
  const currentPlayerId = useGameStore((s) => s.currentPlayerId);
  const enterLobby = useGameStore((s) => s.enterLobby);
  const leaveLobby = useGameStore((s) => s.leaveLobby);

  const handleEnterLobby = (roomId: string, playerId: string) => {
    enterLobby(roomId, playerId);
  };

  return (
    <GameLayout>
      {screen === "lobby" && activeRoomId ? (
        <LobbyScreenContainer
          roomId={activeRoomId}
          currentPlayerId={currentPlayerId}
          onLeave={leaveLobby}
        />
      ) : (
        <StartScreenContainer onEnterLobby={handleEnterLobby} />
      )}
    </GameLayout>
  );
}

export default App;
