export type FrameAnimRuntime = {
  idx: number;
  t: number;
};

export function createFrameAnimRuntime(): FrameAnimRuntime {
  return { idx: 0, t: 0 };
}

export function resetFrameAnim(r: FrameAnimRuntime) {
  r.idx = 0;
  r.t = 0;
}

export function stepFrameAnim(params: {
  r: FrameAnimRuntime;
  dt: number;
  fps: number;
  frameCount: number;
  loop: boolean;
}): { idx: number; advanced: boolean; done: boolean } {
  const { r, dt, fps, frameCount, loop } = params;

  if (frameCount <= 0) return { idx: 0, advanced: false, done: true };

  const frameTime = 1 / Math.max(1, fps);
  r.t += dt;

  if (r.t < frameTime) {
    return { idx: r.idx, advanced: false, done: false };
  }

  r.t = 0;

  if (loop) {
    r.idx = (r.idx + 1) % frameCount;
    return { idx: r.idx, advanced: true, done: false };
  }

  if (r.idx < frameCount - 1) {
    r.idx += 1;
    return { idx: r.idx, advanced: true, done: false };
  }

  return { idx: r.idx, advanced: false, done: true };
}
