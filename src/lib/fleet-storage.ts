import {
  FLEET_KEY,
  bindingIdentity,
  parseFleet,
  mergeDevices,
  canLinkProject,
  type FleetDevice,
} from "./fleet";
import { loadWatchlist } from "./watchlist";
import { parseProjectList } from "./projects";
import { fleetMutationSchema, type FleetMutation } from "./fleet-policy";

export function loadLocalFleet(): FleetDevice[] {
  const raw = localStorage.getItem(FLEET_KEY);
  if (raw) return parseFleet(JSON.parse(raw));
  const legacy = loadWatchlist();
  if (!legacy.ok) throw new Error(legacy.error);
  const devices: FleetDevice[] = legacy.value.map((e) => ({
    id: crypto.randomUUID(),
    name: e.label,
    hardware: "",
    createdAt: e.addedAt,
    bindings: [{ id: crypto.randomUUID(), project: "iota", identifier: e.hotkey, worker: "" }],
  }));
  for (const project of ["xid", "quantus"] as const) {
    const saved = localStorage.getItem("watch:projects:" + project + ":v1");
    if (!saved) continue;
    for (const e of parseProjectList(project, JSON.parse(saved)))
      devices.push({
        id: crypto.randomUUID(),
        name: e.name || project.toUpperCase(),
        hardware: "",
        createdAt: Date.now(),
        bindings: [{ id: crypto.randomUUID(), project, identifier: e.address, worker: "" }],
      });
  }
  // Keep every legacy record, even if already above the Free quota.
  const parsed = parseFleet(devices);
  localStorage.setItem(FLEET_KEY, JSON.stringify(parsed));
  return parsed;
}
export function localFleetMutation(
  devices: FleetDevice[],
  input: FleetMutation,
  limit = 5,
): FleetDevice[] {
  const mutation = fleetMutationSchema.parse(input),
    payload = mutation.payload;
  let next = [...devices];
  const id = "id" in payload ? payload.id : crypto.randomUUID();
  if (mutation.action === "create")
    next.push({
      id,
      name: mutation.payload.name,
      hardware: mutation.payload.hardware,
      createdAt: Date.now(),
      bindings: [],
    });
  else if (!next.some((d) => d.id === id)) throw new Error("device_not_found");
  if (mutation.action === "rename")
    next = next.map((d) =>
      d.id === id ? { ...d, name: mutation.payload.name, hardware: mutation.payload.hardware } : d,
    );
  if (mutation.action === "remove") next = next.filter((d) => d.id !== id);
  if (mutation.action === "unlink")
    next = next.map((d) =>
      d.id === id
        ? { ...d, bindings: d.bindings.filter((b) => b.id !== mutation.payload.bindingId) }
        : d,
    );
  if (mutation.action === "merge") next = mergeDevices(next, id, mutation.payload.sourceId);
  if ("binding" in payload && payload.binding) {
    const binding = { ...payload.binding, id: crypto.randomUUID() };
    if (!canLinkProject(next, id, binding.project, limit))
      throw new Error("project_device_limit_reached");
    if (
      next.flatMap((d) => d.bindings).some((b) => bindingIdentity(b) === bindingIdentity(binding))
    )
      throw new Error("duplicate_binding");
    next = next.map((d) => (d.id === id ? { ...d, bindings: [...d.bindings, binding] } : d));
  }
  return parseFleet(next);
}
