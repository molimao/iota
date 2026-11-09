import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { DiscreteSoloPage } from "@/lib/discrete";

const schema = z.object({
  fromHeight: z.number().int().positive(),
  toHeight: z.number().int().positive(),
  blocks: z.number().int().nonnegative(),
  rewardUnits: z.number().int().nonnegative(),
});

export type DiscreteScanSummary = z.infer<typeof schema>;

export function summarizeDiscreteScan(pages: DiscreteSoloPage[]): DiscreteScanSummary | null {
  const newest = pages[0],
    oldest = pages.at(-1);
  if (!newest || !oldest) return null;
  const blocks = pages.flatMap((page) => page.blocks);
  return {
    fromHeight: oldest.fromHeight,
    toHeight: newest.toHeight,
    blocks: blocks.length,
    rewardUnits: blocks.reduce((total, block) => total + block.rewardUnits, 0),
  };
}

export function useDiscreteScanSummary(userId: string | null) {
  const client = useQueryClient();
  const queryKey = ["xds", "last-solo-scan", userId];
  const storageKey = `watch-xds-last-solo-scan:${userId}`;
  const query = useQuery({
    queryKey,
    enabled: !!userId,
    queryFn: () => {
      try {
        return (
          schema.safeParse(JSON.parse(localStorage.getItem(storageKey) ?? "null")).data ?? null
        );
      } catch {
        return null;
      }
    },
  });
  return {
    summary: query.data ?? null,
    save(summary: DiscreteScanSummary) {
      if (!userId) return;
      client.setQueryData(queryKey, summary);
      try {
        localStorage.setItem(storageKey, JSON.stringify(summary));
      } catch {
        // The lookup result is still available in the current page.
      }
    },
  };
}
