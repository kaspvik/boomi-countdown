import React, { useCallback, useMemo, useState } from "react";
import { PixelButton, PixelFrame, PixelInputField } from "../../layout";
import { BoomiCardAnim } from "../Boomi/BoomiCardAnimation/BoomiCardAnim";
import styles from "./StartActions.module.css";

interface StartActionsProps {
  roomCode: string;
  onRoomCodeChange: (value: string) => void;
  onClickJoin: () => void;
  onClickCreate: () => void;
}

export const StartActions: React.FC<StartActionsProps> = ({
  roomCode,
  onRoomCodeChange,
  onClickJoin,
  onClickCreate,
}) => {
  const [error, setError] = useState<string | null>(null);

  const normalizedCode = useMemo(() => roomCode.trim(), [roomCode]);
  const isValidRoomCode = useMemo(
    () => /^\d{6}$/.test(normalizedCode),
    [normalizedCode]
  );

  const handleRoomCodeChange = useCallback(
    (value: string) => {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
      onRoomCodeChange(digitsOnly);

      if (error && /^\d{6}$/.test(digitsOnly)) setError(null);
      if (error && digitsOnly.length === 0) setError(null);
    },
    [onRoomCodeChange, error]
  );

  const handleJoin = useCallback(() => {
    if (!isValidRoomCode) {
      setError("Room code must be exactly 6 digits.");
      return;
    }
    setError(null);
    onClickJoin();
  }, [isValidRoomCode, onClickJoin]);

  return (
    <div className={styles.frameWrap}>
      <PixelFrame>
        <div className={styles.inputBlock}>
          <PixelInputField
            label="Join a room:"
            placeholder="Enter 6-digit room code"
            value={roomCode}
            inputMode="numeric"
            onChange={(e) => handleRoomCodeChange(e.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? "roomcode-error" : undefined}
          />

          {error ? (
            <p id="roomcode-error" className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
        </div>

        <div className={styles.centerRow}>
          <PixelButton
            onClick={handleJoin}
            className="text-button"
            disabled={normalizedCode.length > 0 && !isValidRoomCode}>
            Enter
          </PixelButton>
        </div>

        <div className={styles.centerRowCreate}>
          <PixelButton onClick={onClickCreate} className="text-button">
            Create a room!
          </PixelButton>
        </div>
      </PixelFrame>

      <div className={styles.boomiBadge} aria-hidden="true">
        <BoomiCardAnim anim="idle" scale={3} />
      </div>
    </div>
  );
};
