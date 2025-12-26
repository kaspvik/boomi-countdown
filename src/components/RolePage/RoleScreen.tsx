import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import styles from "./RoleScreen.module.css";

interface RoleScreenProps {
  role: "civilian" | "imposter";
  hasAcknowledged: boolean;
  allReady: boolean;
  onAcknowledge: () => void;
  imposterTeammates?: string[];
}

function formatNames(names: string[]) {
  const clean = names.filter(Boolean);
  if (clean.length === 0) return "";
  if (clean.length === 1) return clean[0];
  if (clean.length === 2) return `${clean[0]} & ${clean[1]}`;
  return `${clean.slice(0, -1).join(", ")} & ${clean[clean.length - 1]}`;
}

export const RoleScreen: React.FC<RoleScreenProps> = ({
  role,
  hasAcknowledged,
  allReady,
  onAcknowledge,
  imposterTeammates = [],
}) => {
  const isCivilian = role === "civilian";
  const teammates = imposterTeammates.filter(Boolean);

  return (
    <PixelFrame>
      <div className={styles.container}>
        <div className={styles.textBlock}>
          <h2 className={styles.titel}>
            {isCivilian ? "You are a CIVILIAN" : "You are an IMPOSTER"}
          </h2>

          {isCivilian && (
            <p className="text-body-black">
              Stay calm, watch the others and try to figure out who is placing
              Boomi. Work together with the other civilians and don&apos;t get
              blown up.
            </p>
          )}

          {!isCivilian && (
            <p className="text-body-black">
              {teammates.length > 0 ? (
                <>
                  You are secretly on Boomi&apos;s side, together with{" "}
                  <strong>{formatNames(teammates)}</strong>. Place the bomb
                  cleverly, create
                  {formatNames(teammates)}. Place the bomb cleverly, create
                  chaos and try not to get caught.
                </>
              ) : (
                <>
                  You are secretly on Boomi&apos;s side. Place the bomb
                  cleverly, create chaos and try not to get caught.
                </>
              )}
            </p>
          )}
        </div>

        {!hasAcknowledged && (
          <div className={styles.buttonRow}>
            <PixelButton onClick={onAcknowledge} className="text-button">
              Got it!
            </PixelButton>
          </div>
        )}

        {hasAcknowledged && !allReady && (
          <p className={styles.waitingText}>
            Waiting for other players to confirm their role...
          </p>
        )}

        {allReady && (
          <p className={styles.allReadyText}>
            Everyone is ready! The round will start...
          </p>
        )}
      </div>
    </PixelFrame>
  );
};
