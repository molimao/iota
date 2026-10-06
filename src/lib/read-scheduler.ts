/** Avoid a full fleet issuing every public upstream query at once. */
export function createReadScheduler(limit = 4) {
  let active = 0;
  const waiting: (() => void)[] = [];
  return async function schedule<T>(read: () => Promise<T>): Promise<T> {
    if (active >= limit) await new Promise<void>((resolve) => waiting.push(resolve));
    else active++;
    try {
      return await read();
    } finally {
      const next = waiting.shift();
      if (next) next();
      else active--;
    }
  };
}
