import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CALCULATOR_PROJECTS,
  hardwareLabel,
  estimateHardware,
  type HardwareModel,
  type CalculatorProject,
} from "@/lib/hardware-yield";
import {
  HARDWARE_CATALOG as snapshots,
  calculatorModels,
  calculatorModelForProject,
} from "@/lib/hardware-catalog";
import { calculatorDescription } from "@/lib/calculator-discovery";
import { getHardwareYield } from "@/lib/hardware-yield.functions";
import { PROJECTS } from "@/lib/projects";
import { LANGUAGE_TAG } from "@/lib/site";
import { useLocale } from "./site/locale";
import { calculatorCopy as c } from "./hardware-calculator-copy";
import "./hardware-calculator.css";
export function HardwareCalculator({
  project,
  initialModel = "4090",
  initialProject,
  initialHours = 24,
  initialCost = 0.1,
}: {
  project?: CalculatorProject | undefined;
  initialModel?: HardwareModel;
  initialProject?: CalculatorProject | undefined;
  initialHours?: number;
  initialCost?: number;
}) {
  const { locale } = useLocale();
  const [activeProject, setActiveProject] = useState<CalculatorProject | undefined>(
    project ?? initialProject,
  );
  const availableModels = calculatorModels(activeProject);
  const [model, setModel] = useState<HardwareModel>(
      calculatorModelForProject(initialModel, activeProject),
    ),
    [hours, setHours] = useState(initialHours),
    [electricity, setElectricity] = useState(initialCost),
    [choice, setChoice] = useState<CalculatorProject | undefined>(project ?? initialProject);
  function selectProject(next?: CalculatorProject) {
    setActiveProject(next);
    setChoice(next);
    setModel((current) => calculatorModelForProject(current, next));
  }
  const query = useQuery({
    queryKey: ["hardware-yield", model],
    queryFn: () => getHardwareYield({ data: { model } }),
    initialData: () => ({ data: snapshots.find((s) => s.model === model)!, snapshot: true }),
    initialDataUpdatedAt: 0,
    staleTime: 1800000,
    retry: 1,
  });
  const data = query.data.data;
  const ranked = data.rows
    .map((row) => ({ row, ...estimateHardware(row, hours, electricity) }))
    .sort((a, b) => b.gross - a.gross);
  const comparableNet = ranked.every((r) => r.net !== null);
  if (comparableNet) ranked.sort((a, b) => b.net! - a.net!);
  const selected = ranked.find((r) => r.row.project === choice) ?? ranked[0]!;
  const money = (n: number) =>
    new Intl.NumberFormat(LANGUAGE_TAG[locale], {
      style: "currency",
      currency: "USD",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 2,
    }).format(n);
  const t = (k: keyof typeof c) => c[k][locale];
  return (
    <main className="hardware-calculator">
      <header className="calc-intro">
        <span>IOTA Watch · {t("entry")}</span>
        <h1>{project ? `${PROJECTS[project].name} · ${t("entry")}` : t("title")}</h1>
        <p>{project ? calculatorDescription(locale, project) : t("intro")}</p>
      </header>
      <nav className="calc-projects" aria-label={t("chooseProject")}>
        <a
          href={`/${locale}/calculator`}
          aria-current={!activeProject ? "page" : undefined}
          onClick={(event) => {
            if (!project && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
              event.preventDefault();
              selectProject();
            }
          }}
        >
          {t("allProjects")}
        </a>
        {CALCULATOR_PROJECTS.map((id) => (
          <a
            key={id}
            href={`/${locale}/calculator/${id}`}
            aria-current={activeProject === id ? "page" : undefined}
            onClick={(event) => {
              if (!project && !event.metaKey && !event.ctrlKey && !event.shiftKey) {
                event.preventDefault();
                selectProject(id);
              }
            }}
          >
            {PROJECTS[id].name}
          </a>
        ))}
      </nav>
      <section className="calc-workspace" aria-label={t("entry")}>
        <div className="calc-inputs">
          <label>
            {t("hardware")}
            <select value={model} onChange={(e) => setModel(e.target.value as HardwareModel)}>
              {availableModels.map((g) => (
                <option key={g} value={g}>
                  {hardwareLabel(g)}
                </option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend>{t("hours")}</legend>
            <div>
              {[8, 12, 24].map((h) => (
                <button key={h} aria-pressed={hours === h} onClick={() => setHours(h)}>
                  {h} {t("hourly")}
                </button>
              ))}
            </div>
          </fieldset>
          {selected.cost !== null && (
            <details className="calc-power">
              <summary>
                {t("cost")} · ${electricity.toFixed(2)}/kWh
              </summary>
              <label>
                USD / kWh
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={electricity}
                  onChange={(e) =>
                    setElectricity(Math.min(10, Math.max(0, Number(e.target.value))))
                  }
                />
              </label>
            </details>
          )}
        </div>
        <div className="calc-result" data-testid="hardware-result">
          <div className="calc-result-project">
            <b>{PROJECTS[selected.row.project].name}</b>
            {comparableNet && selected === ranked[0] && <small>{t("best")}</small>}
          </div>
          {selected.row.project === "bnt" && <small>{t("fixedReference")} · $0.16/BNT</small>}
          <span>
            {selected.row.basis === "observed"
              ? t("historicalDaily")
              : selected.net === null
                ? t("dailyGross")
                : t("net")}
          </span>
          <strong>
            {money(selected.net ?? selected.gross)} <small>USD</small>
          </strong>
          <p>
            {t("monthly")} · {money(selected.monthlyNet ?? selected.monthlyGross)}
          </p>
          {selected.row.basis === "observed" && (
            <p className="calc-evidence-note">{t("sampleNote")}</p>
          )}
          {selected.net === null && (
            <p className="calc-evidence-note">
              {selected.row.basis === "observed" ? t("noElectricity") : t("noPower")}
            </p>
          )}
          {selected.cost !== null && (
            <div className="calc-breakdown">
              <div>
                <span>{t("gross")}</span>
                <b>{money(selected.gross)}</b>
              </div>
              <div>
                <span>{t("cost")}</span>
                <b>{selected.cost === null ? t("excluded") : `−${money(selected.cost)}`}</b>
              </div>
            </div>
          )}
          <a href={`/${locale}/projects/${selected.row.project}`}>{t("monitor")} ↗</a>
        </div>
      </section>
      {ranked.length > 1 && (
        <section className="calc-comparison">
          <h2>{t("compare")}</h2>
          <p>{t("exclusive")}</p>
          <div className="calc-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>{t("project")}</th>
                  <th>{t("gross")}</th>
                  <th>{t("cost")}</th>
                  <th>{t("netColumn")}</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((result) => (
                  <tr
                    key={result.row.project}
                    data-selected={selected.row.project === result.row.project}
                  >
                    <th>
                      <button
                        onClick={() => {
                          if (project)
                            window.location.href = `/${locale}/calculator/${result.row.project}?gpu=${model}&hours=${hours}&cost=${electricity}`;
                          else selectProject(result.row.project);
                        }}
                        aria-pressed={selected.row.project === result.row.project}
                      >
                        {PROJECTS[result.row.project].name}
                      </button>
                    </th>
                    <td>{money(result.gross)}</td>
                    <td>{result.cost === null ? t("excluded") : money(result.cost)}</td>
                    <td>{result.net === null ? t("excluded") : money(result.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <a
        className="calc-share"
        href={
          project
            ? `/${locale}/calculator/${project}?gpu=${model}&hours=${hours}&cost=${electricity}`
            : `/${locale}/calculator?project=${selected.row.project}&gpu=${model}&hours=${hours}&cost=${electricity}`
        }
      >
        {t("share")} ↗
      </a>
      <details className="calc-assumptions">
        <summary>{t("basis")}</summary>
        <p>
          {selected.row.basis === "observed"
            ? t("iotaBasis")
            : selected.row.project === "bnt"
              ? t("bntAssumption")
              : t("assumption")}
        </p>
        {selected.row.project === "bnt" && <p>{t("bntBasis")}</p>}
        {selected.row.network && (
          <p>
            {t("network")} ·{" "}
            {selected.row.network.hashrate.toLocaleString(LANGUAGE_TAG[locale], {
              maximumFractionDigits: 2,
            })}{" "}
            H/s · #{selected.row.network.height} · {selected.row.network.blockReward.toFixed(8)}{" "}
            BNT/block · 288 blocks/day · $0.16/BNT
          </p>
        )}
        {selected.row.sample && (
          <p>
            {t("sample")} · {selected.row.sample.devices} · {selected.row.sample.start} —{" "}
            {selected.row.sample.end} UTC · {selected.row.sample.days} {t("days")} · {t("zeroDays")}{" "}
            {selected.row.sample.zeroDays} · {t("dailyRange")} {selected.row.sample.min.toFixed(4)}–
            {selected.row.sample.max.toFixed(4)} IOTA
          </p>
        )}
        <p>
          {hardwareLabel(data.model)} · {selected.row.algorithm}
          {selected.row.hashrate !== null &&
            ` · ${selected.row.hashrate.toLocaleString(LANGUAGE_TAG[locale])} H/s`}
          {selected.row.watts !== null && ` · ${selected.row.watts} W`}· {selected.coins.toFixed(4)}{" "}
          {selected.row.unit}
        </p>
        <p>
          {selected.row.basis === "observed"
            ? t("sample")
            : query.data.snapshot || query.isError
              ? t("old")
              : t("live")}{" "}
          · {t("observed")}: {new Date(data.fetchedAt).toLocaleString(LANGUAGE_TAG[locale])}
        </p>
        <a href={selected.row.source ?? data.source} target="_blank" rel="noreferrer">
          {t("reference")} ↗
        </a>
        {selected.row.project === "bnt" && (
          <>
            {" "}
            ·{" "}
            <a
              href="https://bntpool.com/blog/estimate-blocknet-mining-rewards/"
              target="_blank"
              rel="noreferrer"
            >
              BNT · {t("basis")} ↗
            </a>
          </>
        )}
      </details>
    </main>
  );
}
