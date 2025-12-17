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
  return (
    <div className={styles.panel}>
      <PixelFrame>
        {(headerLabel || headerValue) && (
          <div className={panelStyles.headerBox}>
            <p className={panelStyles.headerText}>
              {headerLabel && (
                <span className={panelStyles.headerLabel}>{headerLabel}</span>
              )}
              {headerValue && (
                <span className={panelStyles.headerValue}>{headerValue}</span>
              )}
            </p>
          </div>
        )}

        <h2 className="text-title">{title}</h2>
        {subtitle && <p className="text-subtitle">{subtitle}</p>}

        {targets.length === 0 ? (
          <p className="text-subtitle">{emptyText}</p>
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
                    ].join(" ")}
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

      {footerText && (
        <p className={`text-subtitle ${styles.footer}`}>{footerText}</p>
      )}
    </div>
  );
};
