import type { DiscreteSoloPage } from "@/lib/discrete";
import type { DiscreteDevice } from "./discrete-agent-reading";

export function discreteReviewData(now: number) {
  const tipTime = Date.parse("2026-11-09T06:20:34Z") / 1000;
  now ||= tipTime * 1000;
  const devices: DiscreteDevice[] = ["MacBook Air", "Mac mini"].map((name, index) => {
    const observedAt = new Date(now - 15000).toISOString();
    return {
      name,
      agent: {
        deviceId: `xds-preview-${index}`,
        lastSeen: new Date(now).toISOString(),
        logsEnabled: false,
        recoveryEnabled: false,
        pending: null,
        latestCommand: null,
        snapshot: {
          xds:
            index === 0
              ? { status: "ok", hashrateHps: 294.74, observedAt }
              : { status: "stopped", hashrateHps: null, observedAt },
        },
      },
    };
  });
  const pages: DiscreteSoloPage[] = [
    {
      fromHeight: 99774,
      toHeight: 100773,
      fromTime: tipTime - 90000,
      toTime: tipTime,
      blocks: [
        {
          height: 100773,
          hash: "f5b75acc4d6d4fa255df48add6b69aa867e97e08dfcc5cda4a43f377d036e637",
          timestamp: tipTime,
          rewardUnits: 5183,
        },
      ],
    },
  ];
  return { devices, pages, now };
}
