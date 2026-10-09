import { useLocale } from "./site/locale";
import { discoveryCopy, productQuestions, problemLinks } from "@/lib/product-discovery";
export function DiscoveryQuestions({ answers = false }: { answers?: boolean }) {
  const { locale } = useLocale();
  return (
    <section className="discovery-questions" aria-labelledby="discovery-heading">
      <h2 id="discovery-heading">{discoveryCopy.questions[locale]}</h2>
      {answers ? (
        <div className="discovery-answers">
          {productQuestions(locale).map((q, i) => (
            <details key={q.question}>
              <summary>{q.question}</summary>
              <p>{q.answer}</p>
              {problemLinks[i] && (
                <a
                  href={`/${locale}/${problemLinks[i]!.path}`}
                  aria-label={`${discoveryCopy.steps[locale]}: ${q.question}`}
                >
                  {discoveryCopy.steps[locale]} →
                </a>
              )}
            </details>
          ))}
        </div>
      ) : (
        <nav className="discovery-links">
          {problemLinks.map((p) => (
            <a key={p.id} href={`/${locale}/${p.path}`}>
              {p.q[locale]} <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
      )}
    </section>
  );
}
