import React from "react";
import { PixelButton } from "../PixelButton/PixelButton";

type LeaveButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
};

export const LeaveButton: React.FC<LeaveButtonProps> = ({
  label = "Leave game",
  ...rest
}) => {
  return (
    <PixelButton
      size="sm"
      variant="secondary"
      className="text-button"
      {...rest}>
      {label}
    </PixelButton>
  );
};
