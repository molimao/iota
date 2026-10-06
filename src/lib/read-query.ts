import { createReadScheduler } from "./read-scheduler";
import { withDeadline } from "./deadline";
const schedule = createReadScheduler();
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { retainReadResult, type ReadResult } from "./read-cache";
export function readQuery<R extends ReadResult<unknown>>(
  client: QueryClient,
  key: QueryKey,
  read: () => Promise<R>,
  options: { private?: boolean } = {},
) {
  return {
    queryKey: key,
    queryFn: async () => {
      const bounded = () => withDeadline(read(), 20000, "unavailable");
      try {
        const next = options.private ? await bounded() : await schedule(bounded);
        return retainReadResult(next, client.getQueryData<R>(key));
      } catch (e) {
        if (options.private && e instanceof Error && e.message.startsWith("Unauthorized:"))
          return { data: null, fetchedAt: null, error: "expired", stale: false } as R;
        throw e;
      }
    },
    staleTime: 45000,
    refetchInterval: 60000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  };
}
export function hongKongMonth(now = Date.now()) {
  return new Date(now + 8 * 3600000).toISOString().slice(0, 7);
}
