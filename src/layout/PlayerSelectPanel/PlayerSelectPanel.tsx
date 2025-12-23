import React from "react";
import type { Player } from "../../types/game";
import { PixelButton } from "../PixelButton/PixelButton";
import { PixelFrame } from "../PixelFrame/PixelFrame";
import panelStyles from "../PlayerPanel/PlayerPanel.module.css";
import styles from "./PlayerSelectPanel.module.css";

interface PlayerSelectPanelProps {
  headerLabel?: string;
  headerValue?: string;

  title?: string;
  subtitle?: string;

  targets: Player[];
  selectedTargetId: string | null;
  onSelectTarget: (id: string) => void;

  confirmLabel: string;
  onConfirm: () => void;
  confirmDisabled?: boolean;

  secondaryLabel?: string;
  onSecondary?: () => void;
  secondaryDisabled?: boolean;

  disabled?: boolean;

  footerText?: string;
  emptyText?: string;
}

export const PlayerSelectPanel: React.FC<PlayerSelectPanelProps> = ({
  headerLabel,
  headerValue,
  title,
  subtitle,
  targets,
  selectedTargetId,
  onSelectTarget,
  confirmLabel,
  onConfirm,
  confirmDisabled = false,
  secondaryLabel,
  onSecondary,
  secondaryDisabled = false,
  disabled = false,
  footerText,
  emptyText = "No players available.",
}) => {
  const safeHeaderLabel = headerLabel?.trim();
  const safeHeaderValue = headerValue?.trim();
  const safeTitle = title?.trim();
  const safeSubtitle = subtitle?.trim();

  const safeEmptyText =
    (emptyText ?? "No players available.").trim() || "No players available.";

  return (
    <div className={styles.panel}>
      <PixelFrame>
        {(safeHeaderLabel || safeHeaderValue) && (
          <div className={panelStyles.headerBox}>
            <h1 className={panelStyles.headerText}>
              {safeHeaderLabel && (
                <span className={panelStyles.headerLabel}>
                  {safeHeaderLabel}
                </span>
              )}
              {safeHeaderValue && (
                <span className={panelStyles.headerValue}>
                  {safeHeaderValue}
                </span>
              )}
            </h1>
          </div>
        )}

        {safeTitle && <h2 className="text-title">{safeTitle}</h2>}
        {safeSubtitle && <p className="text-subtitle">{safeSubtitle}</p>}

        {targets.length === 0 ? (
          <p className="text-subtitle">{safeEmptyText}</p>
        ) : (
          <ul className={panelStyles.playersGrid}>
            {targets.map((p) => {
              const isSelected = p.id === selectedTargetId;

              return (
                <li key={p.id}>
                  <button
                    type="button"
                    className={[
                      styles.playerButton,
                      panelStyles.playerItem,
                      isSelected ? styles.selected : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => onSelectTarget(p.id)}
                    disabled={disabled}
                    aria-pressed={isSelected}>
                    {p.name}
                    {p.isHost ? " (host)" : ""}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </PixelFrame>

      <div className={panelStyles.buttonRow}>
        <PixelButton
          onClick={onConfirm}
          className="text-button"
          disabled={confirmDisabled}>
          {confirmLabel}
        </PixelButton>

        {secondaryLabel && onSecondary && (
          <PixelButton
            onClick={onSecondary}
            className="text-button"
            disabled={secondaryDisabled}>
            {secondaryLabel}
          </PixelButton>
        )}
      </div>

      {footerText?.trim() && (
        <p className={`text-subtitle ${styles.footer}`}>{footerText.trim()}</p>
      )}
    </div>
  );
};
