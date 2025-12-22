export type JumpConfig = {
  duration?: number;
  startOffset?: number;
  bounce?: number;
  squash?: number;
};

export type JumpRuntime = {
  active: boolean;
  t: number;
  duration: number;
  startY: number;
  endY: number;
  startOffset: number;
  bounce: number;
  squash: number;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function createJumpRuntime(): JumpRuntime {
  return {
    active: false,
    t: 1,
    duration: 0.75,
    startY: 0,
    endY: 0,
    startOffset: 1,
    bounce: 180,
    squash: 9.15,
  };
}

export function startJump(
  r: JumpRuntime,
  endY: number,
  cfg: JumpConfig = {}
): number {
  r.duration = cfg.duration ?? r.duration;
  r.startOffset = cfg.startOffset ?? r.startOffset;
  r.bounce = cfg.bounce ?? r.bounce;
  r.squash = cfg.squash ?? r.squash;

  r.endY = endY;
  r.startY = endY + r.startOffset;
  r.t = 0;
  r.active = true;

  return r.startY;
}

export function stepJump(
  r: JumpRuntime,
  dt: number
): {
  y: number;
  scaleX: number;
  scaleY: number;
  done: boolean;
} {
  if (!r.active) {
    return { y: r.endY, scaleX: 1, scaleY: 1, done: true };
  }

  r.t += dt / r.duration;
  const t = clamp01(r.t);
  const e = easeOutCubic(t);

  let y = r.startY + (r.endY - r.startY) * e;

  const bounce = Math.sin(t * Math.PI) * -r.bounce;
  y += bounce;

  const stretch = 1 + (1 - e) * r.squash;
  const scaleX = 1 / stretch;
  const scaleY = stretch;

  const done = t >= 1;
  if (done) r.active = false;

  return {
    y: done ? r.endY : y,
    scaleX: done ? 1 : scaleX,
    scaleY: done ? 1 : scaleY,
    done,
  };
}

export const BOOMI_JUMP_PRESET: JumpConfig = {
  duration: 0.45,
  startOffset: 120,
  bounce: 12,
  squash: 0.18,
};

export function startBoomiJump(r: JumpRuntime, endY: number): number {
  return startJump(r, endY, BOOMI_JUMP_PRESET);
}
