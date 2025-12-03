import React from "react";
import styles from "./PixelInputField.module.css";

interface PixelInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const PixelInputField: React.FC<PixelInputFieldProps> = ({
  label,
  id,
  ...inputProps
}) => {
  const inputId =
    id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className={styles.input} {...inputProps} />
    </div>
  );
};
