"use client";

import { useEffect, useState } from "react";

/** Ticks every second while a run is live so elapsed durations update in the UI. */
export function useLiveRunClock(isLive: boolean): number {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!isLive) return;
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [isLive]);

  return nowMs;
}
