import { useCallback } from "react";
import { killPlayer } from "../../services";

export function useTimeoutKillPlayer(params: {
  roomId: string;
  currentPlayerId: string | null;
  canDieOnTimeout: boolean;
}) {
  const { roomId, currentPlayerId, canDieOnTimeout } = params;

  return useCallback(async () => {
    if (!currentPlayerId || !canDieOnTimeout) return;

    try {
      await killPlayer(roomId, currentPlayerId);
    } catch (err) {
      console.error("Failed to kill player on timeout", err);
    }
  }, [roomId, currentPlayerId, canDieOnTimeout]);
}
