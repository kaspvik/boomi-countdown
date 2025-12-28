import React, { useCallback } from "react";
import { useSoundStore, type SfxKey } from "../../store/soundStore";
import styles from "./PixelButton.module.css";

interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  sfxKey?: SfxKey | null;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  sfxKey = "click",
  onPointerDown,
  disabled,
  ...rest
}) => {
  const playSfx = useSoundStore((s) => s.playSfx);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!disabled && sfxKey) {
        playSfx(sfxKey as SfxKey);
      }
      onPointerDown?.(e);
    },
    [disabled, sfxKey, playSfx, onPointerDown]
  );

  return (
    <button
      className={[
        styles.pixelButton,
        styles[variant],
        styles[size],
        disabled ? styles.disabled : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled}
      onPointerDown={handlePointerDown}
      {...rest}>
      <span className={styles.label}>{children}</span>
    </button>
  );
};
