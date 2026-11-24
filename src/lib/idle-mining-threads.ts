export const MAX_IDLE_MINING_THREADS = 8;
export const IDLE_MINING_THREADS = Array.from(
  { length: MAX_IDLE_MINING_THREADS },
  (_, index) => index + 1,
);
