import { bindingIdentity, validBinding, type FleetProject } from "./fleet";
/** Validate the entire batch before any account mutation; never extract IDs from arbitrary text. */
export function projectAddressInput(
  project: FleetProject,
  raw: string,
  existing: string[],
  remaining: number,
) {
  if (raw.length > 6000) throw new Error("invalid");
  const ids = raw
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean);
  if (!ids.length || ids.length > 50 || ids.some((id) => !validBinding(project, id)))
    throw new Error("invalid");
  const key = (identifier: string) => bindingIdentity({ project, identifier, worker: "" });
  const known = new Set(existing.map(key));
  for (const id of ids) {
    const k = key(id);
    if (known.has(k)) throw new Error("duplicate");
    known.add(k);
  }
  if (ids.length > Math.max(0, remaining)) throw new Error("quota");
  return ids;
}
