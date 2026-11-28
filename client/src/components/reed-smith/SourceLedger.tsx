import { SectionJump } from '../SectionJump';
import { sources } from '../../content/reed-smith/sources';

export function SourceLedger() {
  return <section className="rs-section" aria-labelledby="ledger">
    <p className="rs-index">11 / Provenance</p>
    <h2 id="ledger">Source ledger</h2>
    <p className="rs-copy">Public URLs can move or expire. Portfolio repositories are linked outward rather than reproduced.</p>
    <div className="rs-ledger">
      {sources.map((s) => (
        <article key={s.id}>
          <span className="rs-tag">{s.kind}</span>
          <h3>
            {s.href.startsWith('#') ? (
              <SectionJump targetId={s.href.slice(1)}>{s.title}</SectionJump>
            ) : (
              <a href={s.href} target="_blank" rel="noreferrer">{s.title}</a>
            )}
          </h3>
          <p>{s.note}</p>
          <code>{s.id}</code>
        </article>
      ))}
    </div>
  </section>;
}
