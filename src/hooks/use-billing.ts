import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getBilling } from "@/lib/billing.functions";

/** Share verified membership between navigation, account and device views. */
export function useBilling(userId: string | null, ready: boolean) {
  const read = useServerFn(getBilling);
  return useQuery({
    queryKey: ["billing", userId],
    queryFn: () => read(),
    enabled: ready && !!userId,
    staleTime: 15000,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always",
    retry: 1,
  });
}
