import { useState } from "react";
import { ProjectAddressBookView } from "./project-address-book";
import { ProjectAgentConnectView } from "./project-agent-connect";
import { useLocale } from "./site/locale";
import { useAgentClock } from "@/hooks/use-agent-clock";
import { PRL_POOL_IDS, PRL_POOLS } from "@/lib/pool-projects";
import { poolCopy } from "./pool-copy";

/** Local preview only. Same wallet, separate computers and separate pool identities. */
export function PrlWorkerAgentReview({ unpaired = false }: { unpaired?: boolean }) {
  const { locale } = useLocale(),
    now = useAgentClock();
  const pools = [...PRL_POOL_IDS.slice(3), ...PRL_POOL_IDS.slice(0, 3)];
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
          已保存的 Pearl 地址 <small>{pools.length}</small>
        </h2>
        <a href={`/${locale}/devices?project=prl`}>我的设备 →</a>
      </div>
      <div className="prl-pool-groups">
        {pools.map((pool, poolIndex) => (
          <section className="prl-pool-group" key={pool} aria-label={`Pearl · ${pool}`}>
            <div className="prl-pool-heading">
              <div>
                <h3>{PRL_POOLS[pool]}</h3>
                <p>{poolIndex === 0 ? "1 个钱包 · 2 个 Worker" : "1 个钱包 · 1 个 Worker"}</p>
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
                  source: PRL_POOLS[pool],
                  updated: "—",
                  today: pool === "pearlski" || pool === "luckypool" ? "0.71" : null,
                  todayLabel: poolCopy.rolling24h[locale],
                  unit: "PRL",
                  scope: "wallet",
                  lifetime: "2.8",
                  accountSummary: { kind: "balance", amount: "0.59", unit: "PRL" },
                  poolWorkers: {
                    count: poolIndex ? 1 : 2,
                    ...(pool === "peryn" ? { rateUnit: "MAC/s" as const } : {}),
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
