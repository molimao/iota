import { useSyncExternalStore } from "react";
let now = Date.now();
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
function tick() { now = Date.now(); for (const listener of listeners) listener(); }
export function subscribeAgentClock(listener: () => void) {
  listeners.add(listener);
  if (!timer) {
    tick();
    timer = setInterval(tick, 5000);
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", tick);
    if (typeof window !== "undefined") window.addEventListener("focus", tick);
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && timer) {
      clearInterval(timer); timer = undefined;
      if (typeof document !== "undefined") document.removeEventListener("visibilitychange", tick);
      if (typeof window !== "undefined") window.removeEventListener("focus", tick);
    }
  };
}
export const agentClockSnapshot = () => now;
const serverSnapshot = () => 0;
/** Independent of query data changes: a silent device must age into offline. */
export function useAgentClock() {
  return useSyncExternalStore(subscribeAgentClock, agentClockSnapshot, serverSnapshot);
}
