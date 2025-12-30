import React from "react";
import { PixelButton } from "../../layout/PixelButton/PixelButton";
import { PixelFrame } from "../../layout/PixelFrame/PixelFrame";
import styles from "./HowToPlayScreen.module.css";

interface HowToPlayScreenProps {
  onBack: () => void;
}

export const HowToPlayScreen: React.FC<HowToPlayScreenProps> = ({ onBack }) => {
  return (
    <main className={styles.main}>
      <section className={styles.content}>
        <div className={styles.contentInner}>
          <PixelFrame>
            <div className={styles.frameBody}>
              <h1 className={`text-game ${styles.title}`}>HOW TO PLAY:</h1>

              <div className={styles.scrollArea}>
                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Requirements:</b>
                  </h2>
                  <p className={`text-body-black ${styles.p}`}>
                    You can play with <b>4–12 players</b>.
                  </p>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Goal:</b>
                  </h2>
                  <p className={`text-body-black ${styles.p}`}>
                    Civilians win by finding and eliminating all imposters,
                    while imposters win by surviving until they become the
                    majority.
                  </p>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Roles:</b>
                  </h2>
                  <p className={`text-body-black ${styles.p}`}>
                    The number of imposters depends on player count:
                  </p>
                  <ul className={styles.ul}>
                    <li className={`text-body-black ${styles.li}`}>
                      <b>4-6 players</b> → <b>1</b> imposter
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      <b>8-11 players</b> → <b>2</b> imposters
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      <b>12 players</b> → <b>3</b> imposters
                    </li>
                  </ul>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Question Form (Before Each Round):</b>
                  </h2>
                  <p className={`text-body-black ${styles.p}`}>
                    Before the round starts, everyone answers a question. Use
                    the answers to spark discussion and spot suspicious
                    behavior.
                  </p>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Round Timer:</b>
                  </h2>
                  <p className={`text-body-black ${styles.p}`}>
                    Each round lasts <b>60 seconds</b>. When the timer reaches
                    zero, the player holding <b>Boomi</b> explodes and is
                    eliminated.
                  </p>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Round Flow:</b>
                  </h2>
                  <ol className={styles.ol}>
                    <li className={`text-body-black ${styles.li}`}>
                      Everyone answers the <b>Question Form</b>.
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      Boomi is secretly passed to a player.
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      The timer starts (60 seconds).
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      Discuss: accuse, defend, bluff.
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      Use cards if you want (see below).
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      The round ends — someone may explode.
                    </li>
                  </ol>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Host:</b>
                  </h2>
                  <ul className={styles.ul}>
                    <li className={`text-body-black ${styles.li}`}>
                      The player who creates the room becomes the <b>host</b>.
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      The host advances the game by pressing the navigation
                      buttons between screens/steps.
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      If the host is eliminated, host is automatically assigned
                      to a <b>random living player</b>.
                    </li>
                  </ul>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Cards:</b>
                  </h2>
                  <ul className={styles.ul}>
                    <li className={`text-body-black ${styles.li}`}>
                      <b>Block</b> (one-time per game):
                      <br />
                      Can be activated anytime, but only if you are <b>
                        not
                      </b>{" "}
                      holding Boomi. When active, no one can use <b>Pass On</b>{" "}
                      to target you during that round.
                    </li>

                    <li className={`text-body-black ${styles.li}`}>
                      <b>Pass On</b> (once per round):
                      <br />
                      Lets you send Boomi to any player. Can be used once per
                      round.
                    </li>
                  </ul>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Guess Panel:</b>
                  </h2>
                  <p className={`text-body-black ${styles.p}`}>
                    The <b>Guess Panel</b> is the final guessing moment.
                  </p>
                  <ul className={styles.ul}>
                    <li className={`text-body-black ${styles.li}`}>
                      Guess wrong → <b>you</b> are eliminated.
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      Guess right → the <b>imposter</b> is eliminated.
                    </li>
                  </ul>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Win Conditions:</b>
                  </h2>
                  <ul className={styles.ul}>
                    <li className={`text-body-black ${styles.li}`}>
                      <b>Civilians win</b> when all imposters are eliminated.
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      <b>Imposters win</b> when imposters outnumber civilians
                      among living players.
                    </li>
                  </ul>
                </section>

                <section className={styles.section}>
                  <h2 className={`text-body-black ${styles.h2}`}>
                    <b>Tips:</b>
                  </h2>
                  <ul className={styles.ul}>
                    <li className={`text-body-black ${styles.li}`}>
                      Use <b>Block</b> strategically — it’s only once per game.
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      <b>Pass On</b> can save you… or make you look guilty.
                    </li>
                    <li className={`text-body-black ${styles.li}`}>
                      Guessing is risky — don’t guess unless you’re confident.
                    </li>
                  </ul>
                </section>
              </div>

              <div className={styles.buttonRow}>
                <PixelButton onClick={onBack} className="text-button">
                  Back
                </PixelButton>
              </div>
            </div>
          </PixelFrame>
        </div>
      </section>
    </main>
  );
};
