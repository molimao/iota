import { emptyNode, type Platform, type PlatformNode } from "./platforms";
/** Review-only samples. Never returned by an upstream adapter or persisted as device data. */
export function platformSample(project: Platform): PlatformNode {
  const base = emptyNode("sample-device");
  if (project === "tsc") return {...base,scope:"provider",balanceExact:"2.375",pendingBalanceExact:null,balanceUnit:"TSC",rewardUnit:"TSC"};
  if (project === "noid")
    return {
      ...base,
      scope: "provider",
      activity: "1.70 MH/s",
      online: true,
      reward: 0.12,
      rewardUnit: "NOID",
      period: "rolling24h",
      balance: 0.28,
      balanceUnit: "NOID",
      lifetime: 3.68,
    };
  if (project === "acurast") return { ...base, hardware: "Android · Core", partial: false };
  if (project === "akash")
    return {
      ...base,
      name: "Example provider",
      scope: "provider",
      online: true,
      gpuCount: 8,
      activeGpu: 5,
      hardware: "NVIDIA RTX 4090",
    };
  if (project === "golem")
    return {
      ...base,
      name: "Example Golem node",
      online: true,
      cpuCount: 16,
      hardware: "Example CPU",
      reward: 0.72,
      lifetime: 16.82,
      rewardUnit: "GLM",
      period: "rolling24h",
    };
  if (project === "ionet")
    return {
      ...base,
      name: "Example io.net device",
      hardware: "NVIDIA RTX 4090",
      gpuCount: 1,
      reward: 1.25,
      rewardUnit: "IO",
      period: "utcDay",
    };
  return {
    ...base,
    name: "Example Vast.ai host",
    hardware: "NVIDIA RTX 4090",
    gpuCount: 2,
    reward: 4.82,
    rewardUnit: "USD",
    period: "hkDay",
  };
}
