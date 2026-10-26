import type { AgentInfo } from "@/lib/device-agent";
import type { FleetDevice } from "@/lib/fleet";
import { iotaAgentTargets } from "@/lib/project-agent-targets";
import { useLocale } from "./site/locale";
import { AgentBatchPanel } from "./agent-batch";
import { batchCopy } from "./agent-batch-copy";

export function ProjectAgentControls({
  miners,
  devices,
  agents,
  userId,
  now,
  error = false,
}: {
  miners: string[];
  devices: FleetDevice[] | undefined;
  agents: AgentInfo[] | undefined;
  userId: string | null;
  now: number;
  error?: boolean;
}) {
  const { locale } = useLocale();
  if (!userId || !miners.length) return null;
  if (error) return <p role="status">{batchCopy(locale).unavailable}</p>;
  if (!devices || !agents) return null;
  const targets = iotaAgentTargets(devices, agents, miners);
  if (!targets.agents.length && !targets.unpaired.length) return null;
  return (
    <AgentBatchPanel
      key={`${userId}:${miners.slice().sort().join(",")}`}
      agents={targets.agents}
      names={targets.names}
      unpaired={targets.unpaired}
      now={now}
      locale={locale}
      userId={userId}
    />
  );
}
