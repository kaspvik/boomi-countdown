import React from "react";
import styles from "./PixelButton.module.css";

interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...rest
}) => {
  const isDisabled = rest.disabled;

  return (
    <button
      className={[
        styles.pixelButton,
        styles[variant],
        styles[size],
        isDisabled ? styles.disabled : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}>
      <span className={styles.label}>{children}</span>
    </button>
  );
};
