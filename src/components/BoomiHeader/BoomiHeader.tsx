import type { Timestamp } from "firebase/firestore";
import React from "react";
import { GameHeader, GameLogo, GameTimer } from "../../layout";

type HeaderVariant = "start" | "game";

type TimerProps = {
  key?: string;
  mode?: "local" | "server";
  durationSeconds: number;
  startedAt?: Timestamp | null;
  penaltySeconds?: number;
  onTimeout: () => void;
  onTick?: (secondsLeft: number) => void;
};

interface BoomiHeaderProps {
  variant: HeaderVariant;

  onLeave?: () => void;
  timer?: TimerProps;

  right?: React.ReactNode;

  className?: string;
  mode?: "flow" | "overlay";
  leaveLabel?: string;
  leaveDisabled?: boolean;
}

export const BoomiHeader: React.FC<BoomiHeaderProps> = ({
  variant,
  onLeave,
  timer,
  right,
  className,
  mode,
  leaveLabel,
  leaveDisabled,
}) => {
  if (variant === "start") {
    return (
      <GameHeader
        className={className}
        mode={mode}
        right={right}
        center={<GameLogo />}
      />
    );
  }

  if (variant === "game") {
    return (
      <GameHeader
        className={className}
        mode={mode}
        right={right}
        onLeave={onLeave}
        leaveLabel={leaveLabel}
        leaveDisabled={leaveDisabled}
        center={
          timer ? (
            <GameTimer
              key={timer.key}
              mode={timer.mode}
              durationSeconds={timer.durationSeconds}
              startedAt={timer.startedAt}
              penaltySeconds={timer.penaltySeconds}
              onTimeout={timer.onTimeout}
              onTick={timer.onTick}
            />
          ) : undefined
        }
      />
    );
  }

  return (
    <GameHeader
      className={className}
      mode={mode}
      right={right}
      onLeave={onLeave}
      leaveLabel={leaveLabel}
      leaveDisabled={leaveDisabled}
      timer={timer}
    />
  );
};
