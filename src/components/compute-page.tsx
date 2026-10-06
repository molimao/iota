import { LANGUAGE_TAG } from "@/lib/site";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "./site/locale";
import { editorialCopy, projectEditorial } from "./project-editorial";
import { ProjectAbout } from "./project-about";
import { fleetCopy } from "./fleet-copy";
import { validComputeId, type ComputeSnapshot } from "@/lib/compute";
import { getComputeNetwork, getNosanaNode } from "@/lib/compute.functions";
import { PROJECTS, type ComputeProject, type ProjectResult } from "@/lib/projects";
export function ComputeProjectPage({
  project,
  initial,
}: {
  project: ComputeProject;
  initial: ProjectResult<ComputeSnapshot> | null;
}) {
  const { locale } = useLocale(),
    c = editorialCopy(locale),
    f = fleetCopy(locale);
  const [input, setInput] = useState(""),
    [address, setAddress] = useState("");
  const network = useQuery({
    queryKey: ["compute", project],
    queryFn: () => getComputeNetwork({ data: { project } }),
    initialData: initial ?? undefined,
    staleTime: 45000,
    refetchInterval: 60000,
    retry: 1,
  });
  const node = useQuery({
    queryKey: ["nosana", address],
    queryFn: () => getNosanaNode({ data: { address } }),
    enabled: project === "nosana" && validComputeId(project, address),
    staleTime: 45000,
    refetchInterval: 60000,
    retry: 1,
  });
  const n = network.data?.data,
    host = n?.participants.find((p) => p.address === address),
    result = project === "nosana" ? node.data : network.data;
  const bad = network.isError || network.data?.error || network.data?.stale;
  const lookupBad = result?.error || result?.stale || (project === "nosana" && node.isError);
  const metric = (label: string, value: string | number | null | undefined) => (
    <div className="compute-metric" key={label}>
      <span>{label}</span>
      <strong>
        {typeof value === "number" ? value.toLocaleString(LANGUAGE_TAG[locale]) : (value ?? "—")}
      </strong>
    </div>
  );
  return (
    <main id="main" className="projects-page">
      <header className="project-heading">
        <div>
          <h1>{PROJECTS[project].name}</h1>
          <p>{projectEditorial[project].summary[locale]}</p>
        </div>
        <a href={`/${locale}/devices?project=${project}`}>{f.add} →</a>
      </header>
      <section className="compute-panel">
        <p className="compute-caption">
          {project === "nosana" ? c.networkScope : c.epoch}
          {network.data?.fetchedAt
            ? ` · ${new Date(network.data.fetchedAt).toLocaleTimeString(LANGUAGE_TAG[locale])}`
            : ""}
          {bad ? ` · ${n ? f.stale : f.unavailable}` : ""}
        </p>
        <div className="compute-metrics">
          {metric(project === "nosana" ? c.running : c.participants, n?.active)}
          {metric(
            project === "nosana" ? c.completed : c.epoch,
            project === "nosana" ? n?.completed : n?.epoch,
          )}
        </div>
      </section>
      <section className="compute-panel">
        <form
          className="compute-lookup"
          onSubmit={(e) => {
            e.preventDefault();
            if (validComputeId(project, input.trim())) setAddress(input.trim());
          }}
        >
          <label htmlFor="compute-address">{project === "nosana" ? c.nodeId : c.hostId}</label>
          <div>
            <input
              id="compute-address"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={project === "gonka" ? "gonka1…" : "Solana…"}
              maxLength={100}
              spellCheck={false}
              autoComplete="off"
            />
            <button disabled={!validComputeId(project, input.trim())}>{c.lookup}</button>
          </div>
        </form>
        {address && (
          <div aria-live="polite">
            <p className="compute-caption">
              {address.slice(0, 10)}…{address.slice(-6)}
            </p>
            <p>
              {lookupBad
                ? result?.data
                  ? f.stale
                  : f.unavailable
                : project === "nosana"
                  ? node.isPending
                    ? "…"
                    : node.data?.data?.running
                      ? c.computing
                      : c.noJobs
                  : !n
                    ? "—"
                    : host
                      ? c.participating
                      : c.notListed}
            </p>
            <div className="compute-metrics">
              {project === "nosana" ? (
                <>
                  {metric(c.running, node.data?.data?.running)}
                  {metric(c.completed, node.data?.data?.completed)}
                </>
              ) : (
                <>
                  {metric(c.epoch, n?.epoch)}
                  {metric(c.weight, host?.weight)}
                </>
              )}
            </div>
            {host && (
              <p>
                {c.models}: {host.models.join(", ") || "—"}
              </p>
            )}
            <small>{c.noDaily}</small>
          </div>
        )}
      </section>
      <ProjectAbout project={project} />
    </main>
  );
}
