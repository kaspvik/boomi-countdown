import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import { Typewriter } from "../../layout/Typewriter/Typewriter";
import { BoomiHeader } from "../BoomiHeader/BoomiHeader";
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
  const teammateNames = formatNames(teammates);

  const titleText = isCivilian ? "You are a CIVILIAN" : "You are an IMPOSTER";

  const civilianBody =
    "Stay calm, watch the others and try to figure out who is placing Boomi. Work together with the other civilians and don't get blown up.";

  const imposterIntroWithTeam =
    "You are secretly on Boomi's side, together with ";
  const imposterOutroWithTeam =
    ". Place the bomb cleverly, create chaos and try not to get caught.";
  const imposterSolo =
    "You are secretly on Boomi's side. Place the bomb cleverly, create chaos and try not to get caught.";

  const waitingText = "Waiting for other players to confirm their role...";
  const allReadyText = "Everyone is ready! The round will start...";

  const typingKey = `${role}-${teammateNames || "solo"}`;

  return (
    <main className={styles.main}>
      <section className={styles.frameSection}>
        <BoomiHeader variant="lobby" />

        <div className={styles.frameWrapper}>
          <PixelFrame>
            <div className={styles.container}>
              <div className={styles.textBlock}>
                <h2 className={styles.titel}>{titleText}</h2>

                {isCivilian && (
                  <p className="text-body-black">
                    <Typewriter
                      key={`${typingKey}-civ-body`}
                      text={civilianBody}
                      speedMs={22}
                      startDelayMs={260}
                    />
                  </p>
                )}

                {!isCivilian && (
                  <p className="text-body-black">
                    {teammates.length > 0 ? (
                      <>
                        <Typewriter
                          key={`${typingKey}-imp-intro`}
                          text={imposterIntroWithTeam}
                          speedMs={22}
                          startDelayMs={260}
                        />
                        <strong>
                          <Typewriter
                            key={`${typingKey}-imp-names`}
                            text={teammateNames}
                            speedMs={22}
                            startDelayMs={260 + 350}
                          />
                        </strong>
                        <Typewriter
                          key={`${typingKey}-imp-outro`}
                          text={imposterOutroWithTeam}
                          speedMs={22}
                          startDelayMs={260 + 650}
                        />
                      </>
                    ) : (
                      <Typewriter
                        key={`${typingKey}-imp-solo`}
                        text={imposterSolo}
                        speedMs={22}
                        startDelayMs={260}
                      />
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
                <p className={styles.waitingText}>{waitingText}</p>
              )}

              {allReady && (
                <p className={styles.allReadyText}>{allReadyText}</p>
              )}
            </div>
          </PixelFrame>
        </div>
      </section>
    </main>
  );
};
