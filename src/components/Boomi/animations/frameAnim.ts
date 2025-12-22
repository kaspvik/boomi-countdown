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

  const safeFps = Math.max(1, fps);
  const frameTime = 1 / safeFps;

  r.t += dt;

  let advanced = false;

  while (r.t >= frameTime) {
    r.t -= frameTime;

    if (loop) {
      r.idx = (r.idx + 1) % frameCount;
      advanced = true;
      continue;
    }

    if (r.idx < frameCount - 1) {
      r.idx += 1;
      advanced = true;
      continue;
    }

    return { idx: r.idx, advanced, done: true };
  }

  const done = !loop && r.idx === frameCount - 1;
  return { idx: r.idx, advanced, done };
}
