import { useState } from "react";
import { BntDashboardView } from "./bnt-dashboard";
import { ProjectAgentConnectView } from "./project-agent-connect";
import { ProjectMinerSlots } from "./device-miner-summary";
import { useLocale } from "./site/locale";
import { useAgentClock } from "@/hooks/use-agent-clock";
import type { BntRow } from "@/lib/bnt-dashboard";
import type { AgentInfo } from "@/lib/device-agent";

// DEV route only. Shared production wallet/Worker components, no account writes.
export function BntWorkerAgentReview({ unpaired = false }: { unpaired?: boolean }) {
  const { locale } = useLocale(),
    now = useAgentClock();
  const [links, setLinks] = useState<Record<string, string>>({}),
    [choices, setChoices] = useState<Record<string, string>>({});
  const computers = [
    { id: "mini", name: "Mac mini" },
    { id: "pro", name: "MacBook Pro" },
    { id: "studio", name: "Mac Studio" },
  ];
  const workers = ["mini-cpu-01", "mini-cpu-02", "office-cpu-03"];
  const row: BntRow = {
    id: "preview-wallet",
    name: "BNT 收益钱包",
    address: "demo-public-bnt-payout-address",
    worker: "",
    result: {
      error: null,
      fetchedAt: now,
      stale: false,
      data: {
        hashrate: 21.4,
        paid: 28.46,
        balance: 1.24,
        pendingEstimate: 0.62,
        queued: 0,
        reward: 3.5,
        period: "rolling24h",
        partial: false,
        workerCount: 3,
        workers: workers.map((name, i) => ({
          name,
          hashrate: [7.1, 6.8, 7.5][i]!,
          online: true,
          lastSeen: now - 15000,
        })),
      },
    },
  };
  return (
    <BntDashboardView
      preview
      rows={[row]}
      ready
      refreshing={false}
      signedIn
      limit={5}
      targets={[]}
      onLookup={() => {}}
      onRefresh={async () => {}}
      onLogin={async () => {}}
      onSave={async () => {}}
      onRemove={async () => {}}
      onRename={async () => {}}
      workerAgent={(_, worker) => {
        const index = workers.indexOf(worker),
          chosen =
            links[worker] ??
            (!unpaired && index === 0 ? "mini" : !unpaired && index === 2 ? "pro" : "");
        const binding = {
          id: `11111111-1111-4111-8111-11111111111${index}`,
          project: "bnt" as const,
          identifier: row.address,
          worker,
        };
        const agent: AgentInfo | undefined = chosen
          ? {
              deviceId: chosen,
              lastSeen: new Date(now).toISOString(),
              logsEnabled: false,
              recoveryEnabled: false,
              pending: null,
              latestCommand: null,
              snapshot: {
                miners: [
                  {
                    project: "bnt",
                    software: "seine",
                    bindingId: binding.id,
                    status: "ok",
                    observedAt: new Date(now).toISOString(),
                    hashrate10s: null,
                    hashrate60s: null,
                    hashrateSession: [7.2, 6.9, 7.6][index]!,
                    rateWindow: "session",
                    rateUnit: "H/s",
                    counterUnit: "blocks",
                    accepted: [108, 93, 126][index]!,
                    rejected: null,
                    uptime: 7200,
                  },
                ],
              },
            }
          : undefined;
        return (
          <section className="bnt-worker-agent" aria-label={`${worker} Agent`}>
            {chosen ? (
              <>
                <strong className="bnt-worker-computer">
                  {computers.find((c) => c.id === chosen)?.name}
                  <small data-online="true">
                    {
                      {
                        zh: "Agent 在线",
                        "zh-TW": "Agent 在線",
                        en: "Agent online",
                        ko: "Agent 온라인",
                        ja: "Agent オンライン",
                      }[locale]
                    }
                  </small>
                </strong>
                <ProjectMinerSlots agent={agent} bindings={[binding]} now={now} locale={locale} />
              </>
            ) : (
              <p className="compute-caption">
                {
                  {
                    zh: "此 Worker 尚未关联电脑",
                    "zh-TW": "此 Worker 尚未關聯電腦",
                    en: "This Worker is not linked to a computer",
                    ko: "이 Worker에 연결된 컴퓨터가 없습니다",
                    ja: "この Worker はコンピューターに未接続です",
                  }[locale]
                }
              </p>
            )}
            <ProjectAgentConnectView
              locale={locale}
              worker={worker}
              connected={!!chosen}
              choices={computers}
              selected={choices[worker] ?? ""}
              onSelect={(id) => setChoices((s) => ({ ...s, [worker]: id }))}
              onSubmit={() => setLinks((s) => ({ ...s, [worker]: choices[worker]! }))}
            />
          </section>
        );
      }}
    />
  );
}
