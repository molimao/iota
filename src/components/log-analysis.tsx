import type { SavedAnalysis } from "@/lib/log-analysis";
import { useLocale } from "./site/locale";
import { logCopy as c } from "./log-analysis-copy";
export function AnalysisResult({ result }: { result: SavedAnalysis }) {
  const { locale } = useLocale();
  return (
    <article className="log-analysis-result" role="status">
      <header>
        <h3>{result.summary}</h3>
        <small>{c[result.confidence][locale]}</small>
      </header>
      {!!result.nextSteps.length && (
        <section>
          <h4>{c.steps[locale]}</h4>
          <ol>
            {result.nextSteps.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ol>
        </section>
      )}
      {!!result.findings.length && (
        <details className="log-analysis-evidence">
          <summary>
            {c.evidence[locale]} · {result.findings.length}
          </summary>
          {result.findings.map((f, i) => (
            <section key={i}>
              <h4>{f.title}</h4>
              <p>{f.explanation}</p>
              <pre>
                {result.evidence
                  .filter((e) => f.lines.includes(e.line))
                  .map((e) => `L${e.line} ${e.text}`)
                  .join("\n")}
              </pre>
            </section>
          ))}
        </details>
      )}
      {!!result.unknowns.length && (
        <details className="log-analysis-unknown">
          <summary>{c.unknown[locale]}</summary>
          <ul>
            {result.unknowns.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </details>
      )}
    </article>
  );
}
