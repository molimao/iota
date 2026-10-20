import { useQueries } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "./use-auth";
import { getBntWorkerHistory } from "@/lib/bnt-worker-history.functions";
import type { BntRow } from "@/lib/bnt-dashboard";
export function useBntWorkerHistory(
  rows: BntRow[],
  signedIn: boolean,
  ready: boolean,
  preview: boolean,
) {
  const auth = useAuth(),
    read = useServerFn(getBntWorkerHistory);
  const addresses = [...new Set(rows.map((r) => r.address))];
  const queries = useQueries({
    queries: addresses.map((address) => ({
      queryKey: ["bnt-worker-history", auth.userId, address],
      queryFn: () => read({ data: { address } }),
      enabled: !!auth.userId && signedIn && ready && !preview,
      staleTime: 300000,
      refetchInterval: 300000,
      refetchIntervalInBackground: false,
      retry: 1,
    })),
  });
  return (address: string) =>
    signedIn && !preview ? queries[addresses.indexOf(address)] : undefined;
}
