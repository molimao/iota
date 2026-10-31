import { useState } from "react";
import { ProjectAddressBookView } from "./project-address-book";
import { ProjectAgentConnectView } from "./project-agent-connect";
import { useLocale } from "./site/locale";
import { useAgentClock } from "@/hooks/use-agent-clock";
import type { AgentInfo } from "@/lib/device-agent";
import { poolCopy } from "./pool-copy";

/** Local preview only. Same wallet, separate computers and separate pool identities. */
export function PrlWorkerAgentReview({ unpaired = false }: { unpaired?: boolean }) {
  const { locale } = useLocale(),
    now = useAgentClock();
  const [links, setLinks] = useState<Record<string, string>>({});
  const [choices, setChoices] = useState<Record<string, string>>({});
  const computers = [
    { id: "linux", name: "Linux GPU" },
    { id: "mini", name: "Mac mini" },
  ];
  return (
    <section className="project-address-book" data-project="prl" aria-label="Pearl 地址">
      <div className="project-section-head">
        <h2>
          已保存的 Pearl 地址 <small>2</small>
        </h2>
        <a href={`/${locale}/devices?project=prl`}>我的设备 →</a>
      </div>
      <div className="prl-pool-groups">
      {(["luckypool", "kryptex"] as const).map((pool, poolIndex) => (
        <section className="prl-pool-group" key={pool} aria-label={`Pearl · ${pool}`}>
          <div className="prl-pool-heading">
            <div>
              <h3>{pool === "luckypool" ? "LuckyPool" : "Kryptex"}</h3>
              <p>
                {pool === "luckypool"
                  ? "1 个钱包 · 2 个 Worker"
                  : "1 个钱包 · 1 个 Worker"}
              </p>
            </div>
          </div>
          <ProjectAddressBookView
            project="prl"
            pool={pool}
            locale={locale}
            signedIn
            savedCount={1}
            limit={50}
            showSectionHead={false}
            cards={[
              {
                deviceId: `wallet-${pool}`,
                deviceName: "Pearl 钱包",
                bindingId: `wallet-${pool}`,
                identifier: "demo-public-prl-wallet",
                status: "mining",
                activity: "",
                source: pool,
                updated: "—",
                today: "0.71",
                todayLabel: poolCopy.rolling24h[locale],
                unit: "PRL",
                scope: "wallet",
                lifetime: "2.8",
                accountSummary: { kind: "balance", amount: "0.59", unit: "PRL" },
                poolWorkers: {
                  count: poolIndex ? 1 : 2,
                  workers: (poolIndex ? ["gpu-01"] : ["gpu-01", "gpu-02"]).map((name, i) => ({
                    name,
                    hashrate: (40 + i * 10) * 1e12,
                    online: true,
                    lastSeen: now,
                  })),
                },
              },
            ]}
            workerAgent={(_, worker) => {
              const key = `${pool}:${worker}`;
              const linked =
                links[key] ??
                (unpaired ? "" : poolIndex ? "" : worker === "gpu-01" ? "linux" : "mini");
              const binding = {
                id: `11111111-1111-4111-8111-11111111111${worker === "gpu-01" ? poolIndex : 2}`,
                project: "prl" as const,
                identifier: "demo-public-prl-wallet",
                pool,
                worker,
              };
              const agent: AgentInfo | undefined = linked
                ? {
                    deviceId: linked,
                    lastSeen: new Date(now).toISOString(),
                    logsEnabled: false,
                    recoveryEnabled: false,
                    pending: null,
                    latestCommand: null,
                    snapshot: {
                      platform: linked === "linux" ? "linux" : "darwin",
                      miners:
                        linked === "linux"
                          ? []
                          : [
                              {
                                project: "prl",
                                software: "pearl-metal",
                                bindingId: binding.id,
                                status: "process",
                                observedAt: new Date(now).toISOString(),
                                appCpu: 45,
                                processMemoryMb: 450,
                                hashrate10s: null,
                                hashrate60s: null,
                                accepted: null,
                                rejected: null,
                                uptime: null,
                              },
                            ],
                    },
                  }
                : undefined;
              return (
                <section className="bnt-worker-agent" aria-label={`${pool} ${worker} 对应电脑`}>
                  {linked ? (
                    <>
                      <strong className="bnt-worker-computer">
                        {computers.find((c) => c.id === linked)?.name}
                        <small data-online="true">电脑在线</small>
                      </strong>
                      {linked === "linux" && (
                        <p className="compute-caption">
                          这台是 Linux，暂时看不到本机数据；矿池算力和 Worker 状态仍可用。
                        </p>
                      )}
                    </>
                  ) : null}
                  <ProjectAgentConnectView
                    locale={locale}
                    worker={worker}
                    choices={computers}
                    connected={!!linked}
                    selected={choices[key] ?? ""}
                    onSelect={(id) => setChoices((s) => ({ ...s, [key]: id }))}
                    onSubmit={() => setLinks((s) => ({ ...s, [key]: choices[key]! }))}
                  />
                </section>
              );
            }}
          />
        </section>
      ))}
      </div>
    </section>
  );
}
