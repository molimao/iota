import { useState } from "react";
import { ProjectAddressBookView } from "./project-address-book";
import { ProjectAgentConnectView } from "./project-agent-connect";
import { ProjectMinerSlots } from "./device-miner-summary";
import { useLocale } from "./site/locale";
import { useAgentClock } from "@/hooks/use-agent-clock";
import type { AgentInfo } from "@/lib/device-agent";

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
    <>
      {(["luckypool", "kryptex"] as const).map((pool, poolIndex) => (
        <ProjectAddressBookView
          key={pool}
          project="prl"
          pool={pool}
          locale={locale}
          signedIn
          savedCount={1}
          limit={50}
          cards={[
            {
              deviceId: `wallet-${pool}`,
              deviceName: `Pearl · ${pool === "luckypool" ? "LuckyPool" : "Kryptex"}`,
              bindingId: `wallet-${pool}`,
              identifier: "demo-public-prl-wallet",
              status: "mining",
              activity: "",
              source: pool,
              updated: "—",
              today: "0.71",
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
              <section className="bnt-worker-agent" aria-label={`${pool} ${worker} Agent`}>
                {linked ? (
                  <>
                    <strong className="bnt-worker-computer">
                      {computers.find((c) => c.id === linked)?.name}
                      <small data-online="true">Agent</small>
                    </strong>
                    <ProjectMinerSlots
                      agent={agent}
                      bindings={[binding]}
                      now={now}
                      locale={locale}
                    />
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
      ))}
    </>
  );
}
