import React, { useCallback } from "react";
import { useSoundStore } from "../../store/soundStore";
import styles from "./SoundToggleButton.module.css";

export const SoundToggleButton: React.FC = () => {
  const bgmMuted = useSoundStore((s) => s.bgmMuted);
  const sfxMuted = useSoundStore((s) => s.sfxMuted);

  const setBgmMuted = useSoundStore((s) => s.setBgmMuted);
  const setSfxMuted = useSoundStore((s) => s.setSfxMuted);

  const playSfx = useSoundStore((s) => s.playSfx);

  const isMuted = bgmMuted && sfxMuted;

  const onToggle = useCallback(() => {
    if (!isMuted) playSfx("click");
    const next = !isMuted;
    setBgmMuted(next);
    setSfxMuted(next);
  }, [isMuted, playSfx, setBgmMuted, setSfxMuted]);

  const src = isMuted ? "/soundbutton-off.png" : "/soundbutton-on.png";

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onToggle}
      aria-pressed={isMuted}
      aria-label={isMuted ? "Turn sound on" : "Turn sound off"}
      title={isMuted ? "Sound OFF" : "Sound ON"}>
      <img
        className={styles.icon}
        src={src}
        alt=""
        aria-hidden="true"
        draggable={false}
      />
    </button>
  );
};
