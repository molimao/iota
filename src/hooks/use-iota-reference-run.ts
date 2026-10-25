import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getRuns } from "@/lib/iota.functions";
import { appReferenceRun } from "@/lib/iota-run";

export function useIotaReferenceRun(enabled: boolean) {
  const read = useServerFn(getRuns);
  const query = useQuery({
    queryKey: ["iota", "runs"],
    queryFn: () => read({ data: { force: false } }),
    enabled,
    staleTime: 120000,
    refetchInterval: 300000,
    retry: false,
  });
  return enabled
    ? appReferenceRun(
        query.data?.runs,
        query.isError ||
          !!query.data?.error ||
          !!query.data?.stale ||
          !query.data?.fetchedAt ||
          Date.now() - query.data.fetchedAt > 600000,
      )
    : null;
}
