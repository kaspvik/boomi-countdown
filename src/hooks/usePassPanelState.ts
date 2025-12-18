import { useCallback, useState } from "react";

interface UsePassPanelStateParams {
  isAlive: boolean;
  isGuessOpen: boolean;
}

export function usePassPanelState({
  isAlive,
  isGuessOpen,
}: UsePassPanelStateParams) {
  const [isPassPanelOpen, setIsPassPanelOpen] = useState(false);

  const openPassPanel = useCallback(() => {
    if (!isAlive) return;
    if (isGuessOpen) return;
    setIsPassPanelOpen(true);
  }, [isAlive, isGuessOpen]);

  const closePassPanel = useCallback(() => {
    setIsPassPanelOpen(false);
  }, []);

  return {
    isPassPanelOpen,
    openPassPanel,
    closePassPanel,
  };
}
