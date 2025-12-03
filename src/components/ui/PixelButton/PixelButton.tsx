import React from "react";
import styles from "./PixelButton.module.css";

interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // om du vill ha future variants sen
  variant?: "primary" | "secondary";
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = "primary",
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
        isDisabled ? styles.disabled : "",
        className,
        onclick,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}>
      <span className={styles.label}>{children}</span>
    </button>
  );
};
