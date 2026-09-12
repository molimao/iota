/** Reject if `work` has not settled before `ms`. Does not cancel the underlying work. */
export function withDeadline<T>(work: Promise<T>, ms: number, message: string): Promise<T> {
  if (ms <= 0) return Promise.reject(new Error(message));
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    work.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
